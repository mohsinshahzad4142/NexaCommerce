import json
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.shipping import ShippingZone, ShippingMethod, Shipment, ShipmentTrackingLog
from app.models.order import Order
from app.schemas.shipping import (
    ShippingZoneCreate, ShippingZoneResponse,
    ShippingMethodCreate, ShippingMethodResponse,
    ShippingRateQuery, RateOptionResponse,
    CreateShipmentRequest, ShipmentResponse
)
from app.services.courier_service import CourierFactory

router = APIRouter()

# --- 1. ADMIN: ZONE & METHOD MANAGEMENT ---
@router.post("/admin/shipping/zones", response_model=ShippingZoneResponse)
def create_shipping_zone(zone_in: ShippingZoneCreate, db: Session = Depends(get_db)):
    zone = ShippingZone(**zone_in.dict())
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone

@router.get("/admin/shipping/zones", response_model=List[ShippingZoneResponse])
def get_shipping_zones(db: Session = Depends(get_db)):
    return db.query(ShippingZone).all()

@router.post("/admin/shipping/methods", response_model=ShippingMethodResponse)
def create_shipping_method(method_in: ShippingMethodCreate, db: Session = Depends(get_db)):
    zone = db.query(ShippingZone).filter(ShippingZone.id == method_in.zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Shipping Zone not found")
    
    method = ShippingMethod(**method_in.dict())
    db.add(method)
    db.commit()
    db.refresh(method)
    return method


# --- 2. CHECKOUT RATE CALCULATION ENGINE ---
@router.post("/shipping/calculate-rates", response_model=List[RateOptionResponse])
def calculate_shipping_rates(query: ShippingRateQuery, db: Session = Depends(get_db)):
    city_normalized = query.city.strip().title()
    zones = db.query(ShippingZone).filter(ShippingZone.is_active == True).all()

    matched_zone = None
    for z in zones:
        cities = z.cities or []
        if "*" in cities or city_normalized in [c.title() for c in cities]:
            matched_zone = z
            break

    if not matched_zone:
        # Fallback to default nationwide zone if available
        matched_zone = db.query(ShippingZone).filter(ShippingZone.name.ilike("%Pakistan%")).first()

    if not matched_zone:
        return []

    available_methods = db.query(ShippingMethod).filter(
        ShippingMethod.zone_id == matched_zone.id,
        ShippingMethod.is_active == True
    ).all()

    results = []
    for m in available_methods:
        cost = m.base_cost

        if m.rate_type == "free_shipping":
            if m.min_order_amount and query.subtotal >= m.min_order_amount:
                cost = 0.0
            else:
                continue # Skip free shipping if min order criteria not met

        elif m.rate_type == "weight_based":
            if m.min_weight_kg <= query.total_weight_kg <= (m.max_weight_kg or 9999):
                extra_weight = max(0.0, query.total_weight_kg - 1.0)
                cost = m.base_cost + (extra_weight * m.cost_per_kg)
            else:
                continue

        elif m.rate_type == "price_based":
            if m.min_order_amount and query.subtotal < m.min_order_amount:
                continue
            if m.max_order_amount and query.subtotal > m.max_order_amount:
                continue

        results.append(RateOptionResponse(
            method_id=m.id,
            method_name=m.name,
            shipping_cost=round(cost, 2),
            estimated_days=f"{m.estimated_days_min}-{m.estimated_days_max} Days",
            rate_type=m.rate_type
        ))

    return results


# --- 3. COURIER BOOKING & SHIPMENT CREATION ---
@router.post("/admin/shipments/create", response_model=ShipmentResponse)
def create_order_shipment(req: CreateShipmentRequest, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    existing_shipment = db.query(Shipment).filter(Shipment.order_id == req.order_id).first()
    if existing_shipment:
        raise HTTPException(status_code=400, detail="Shipment already exists for this order")

    recipient_address = json.loads(order.shipping_address_json)
    
    # Book with selected Courier Service API
    adapter = CourierFactory.get_adapter(req.courier_code)
    booking_res = adapter.create_waybill(order.id, recipient_address, req.weight_kg)

    dispatch_time = datetime.utcnow()
    est_delivery = dispatch_time + timedelta(days=booking_res.get("estimated_days", 3))

    shipment = Shipment(
        order_id=order.id,
        courier_code=booking_res["courier_code"],
        courier_name=booking_res["courier_name"],
        tracking_number=booking_res["tracking_number"],
        status="picked_up",
        dispatch_date=dispatch_time,
        estimated_delivery_date=est_delivery,
        weight_kg=req.weight_kg,
        shipping_cost=order.shipping_cost
    )
    db.add(shipment)
    db.flush()

    # Update Order Tracking Info
    order.tracking_number = shipment.tracking_number
    order.courier_name = shipment.courier_name
    order.status = "shipped"

    # Initial Log Entry
    initial_log = ShipmentTrackingLog(
        shipment_id=shipment.id,
        status="picked_up",
        location="Origin Warehouse",
        description=f"Package picked up by {shipment.courier_name} with Tracking #{shipment.tracking_number}"
    )
    db.add(initial_log)
    db.commit()
    db.refresh(shipment)
    return shipment


# --- 4. SHIPMENT LIVE TRACKING (PUBLIC) ---
@router.get("/shipping/track/{tracking_number}", response_model=ShipmentResponse)
def track_shipment_public(tracking_number: str, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.tracking_number == tracking_number).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found for this tracking number")
    return shipment