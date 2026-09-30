from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

from app.db.database import get_db
from app.schemas.multitenant_vendor import (
    StoreCreateSchema, StoreResponseSchema,
    VendorCreateSchema, VendorResponseSchema,
    VendorPayoutRequestSchema, CurrencyConvertSchema
)
from app.models.multitenant_vendor import Store, Vendor, VendorCommission, VendorPayout, ExchangeRate
from app.core.multitenant_vendor_engine import MultiTenantVendorEngine

router = APIRouter()

# --- 1. MULTI-STORE / TENANT MANAGEMENT ---
@router.post("/multitenant/stores", response_model=StoreResponseSchema)
def create_store(req: StoreCreateSchema, db: Session = Depends(get_db)):
    existing = db.query(Store).filter(Store.subdomain == req.subdomain).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subdomain already exists.")

    store = Store(**req.dict())
    db.add(store)
    db.commit()
    db.refresh(store)
    return store


@router.get("/multitenant/stores", response_model=List[StoreResponseSchema])
def list_stores(db: Session = Depends(get_db)):
    return db.query(Store).all()


@router.get("/multitenant/resolve")
def resolve_tenant_by_domain(host: str = Query(..., description="Hostname or Domain Header"), db: Session = Depends(get_db)):
    store = db.query(Store).filter((Store.subdomain == host) | (Store.custom_domain == host)).first()
    if not store:
        # Default to primary platform store
        store = db.query(Store).first()
    return store


# --- 2. MULTI-VENDOR MARKETPLACE ---
@router.post("/marketplace/vendors", response_model=VendorResponseSchema)
def register_vendor(req: VendorCreateSchema, db: Session = Depends(get_db)):
    existing = db.query(Vendor).filter(Vendor.slug == req.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vendor slug already in use.")

    vendor = Vendor(
        store_id=req.store_id,
        user_id=req.user_id,
        business_name=req.business_name,
        slug=req.slug,
        commission_rate=req.commission_rate,
        bank_details=req.bank_details,
        status="approved"
    )
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor


@router.get("/marketplace/vendors/{vendor_id}/dashboard")
def get_vendor_dashboard(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found.")

    commissions = db.query(VendorCommission).filter(VendorCommission.vendor_id == vendor_id).all()
    payouts = db.query(VendorPayout).filter(VendorPayout.vendor_id == vendor_id).all()

    total_sales = sum([c.item_amount for c in commissions])
    total_commission_paid = sum([c.commission_amount for c in commissions])
    total_vendor_earnings = sum([c.vendor_payout_amount for c in commissions])
    total_payouts_completed = sum([p.amount for p in payouts if p.status == "completed"])
    pending_payout_balance = total_vendor_earnings - total_payouts_completed

    return {
        "vendor_id": vendor.id,
        "business_name": vendor.business_name,
        "commission_rate": f"{vendor.commission_rate}%",
        "total_sales": total_sales,
        "platform_commission_deducted": total_commission_paid,
        "total_vendor_earnings": total_vendor_earnings,
        "total_payouts_completed": total_payouts_completed,
        "pending_payout_balance": max(0.0, pending_payout_balance)
    }


# --- 3. VENDOR PAYOUT MANAGEMENT ---
@router.post("/marketplace/payouts/process")
def process_vendor_payout(req: VendorPayoutRequestSchema, db: Session = Depends(get_db)):
    payout = VendorPayout(
        vendor_id=req.vendor_id,
        amount=req.amount,
        currency=req.currency,
        payment_method=req.payment_method,
        status="completed",
        processed_at=datetime.utcnow()
    )
    db.add(payout)
    db.commit()
    return {"message": "Vendor payout processed successfully.", "payout_id": payout.id}


# --- 4. MULTI-CURRENCY CONVERSION API ---
@router.post("/multitenant/currency/convert")
def convert_currency(req: CurrencyConvertSchema):
    # Simulated exchange rates relative to base currency (USD)
    rates = {"USD": 1.0, "PKR": 278.50, "EUR": 0.92, "AED": 3.67, "GBP": 0.79}
    converted = MultiTenantVendorEngine.convert_currency(req.amount, req.from_currency, req.to_currency, rates)
    return {
        "original_amount": req.amount,
        "from_currency": req.from_currency,
        "to_currency": req.to_currency,
        "converted_amount": converted
    }