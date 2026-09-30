from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

from app.db.database import get_db
from app.schemas.mobile_app import (
    DeviceTokenRegisterSchema, PushNotificationSendSchema,
    RiderLocationUpdateSchema, DeliveryStatusUpdateSchema
)
from app.models.mobile_app import DeviceToken, DeliveryRider, DeliveryAssignment, RiderLocationLog
from app.core.mobile_engine import MobileEngine

router = APIRouter()

# --- 1. PHASE 1: DYNAMIC PWA MANIFEST API ---
@router.get("/mobile/pwa/manifest.json")
def get_pwa_manifest(store_name: str = Query("NexaCommerce")):
    return MobileEngine.generate_pwa_manifest(store_name=store_name)


# --- 2. PHASE 2: MOBILE DEVICE TOKEN REGISTRATION (ALL 4 APPS) ---
@router.post("/mobile/devices/register")
def register_device_token(req: DeviceTokenRegisterSchema, db: Session = Depends(get_db)):
    existing = db.query(DeviceToken).filter(DeviceToken.device_token == req.device_token).first()
    if existing:
        existing.user_id = req.user_id
        existing.app_type = req.app_type
        existing.platform = req.platform
        existing.last_active_at = datetime.utcnow()
    else:
        dev_token = DeviceToken(
            user_id=req.user_id,
            device_token=req.device_token,
            app_type=req.app_type,
            platform=req.platform
        )
        db.add(dev_token)
    db.commit()
    return {"message": f"Device token registered successfully for '{req.app_type}' app."}


# --- 3. FCM PUSH NOTIFICATION DISPATCHER ---
@router.post("/mobile/notifications/send-push")
def send_push_notification(req: PushNotificationSendSchema, db: Session = Depends(get_db)):
    query = db.query(DeviceToken.device_token).filter(DeviceToken.app_type == req.app_type, DeviceToken.is_active == True)
    if req.target_user_id:
        query = query.filter(DeviceToken.user_id == req.target_user_id)
    
    tokens = [t[0] for t in query.all()]
    result = MobileEngine.dispatch_fcm_push_notification(tokens, req.title, req.body, req.data_payload or {})
    return result


# --- 4. DELIVERY APP: RIDER LIVE LOCATION TRACKING ---
@router.patch("/mobile/delivery/location")
def update_rider_location(req: RiderLocationUpdateSchema, db: Session = Depends(get_db)):
    rider = db.query(DeliveryRider).filter(DeliveryRider.id == req.rider_id).first()
    if not rider:
        raise HTTPException(status_code=404, detail="Rider profile not found.")

    rider.current_lat = req.lat
    rider.current_lng = req.lng
    rider.last_location_update = datetime.utcnow()

    # Log location history for order route audit
    log = RiderLocationLog(rider_id=req.rider_id, lat=req.lat, lng=req.lng)
    db.add(log)
    db.commit()

    return {"message": "Rider location updated.", "status": rider.status}


# --- 5. DELIVERY APP: GET ASSIGNED ORDERS & UPDATE STATUS ---
@router.get("/mobile/delivery/assignments")
def get_rider_assignments(rider_id: int, db: Session = Depends(get_db)):
    assignments = db.query(DeliveryAssignment).filter(DeliveryAssignment.rider_id == rider_id).all()
    return assignments


@router.patch("/mobile/delivery/assignments/status")
def update_delivery_status(req: DeliveryStatusUpdateSchema, db: Session = Depends(get_db)):
    assignment = db.query(DeliveryAssignment).filter(DeliveryAssignment.id == req.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Delivery assignment not found.")

    assignment.status = req.status
    if req.notes:
        assignment.notes = req.notes
    if req.proof_of_delivery_url:
        assignment.proof_of_delivery_url = req.proof_of_delivery_url
    if req.status == "delivered":
        assignment.delivered_at = datetime.utcnow()

    db.commit()
    return {"message": f"Delivery assignment status changed to '{req.status}'."}


# --- 6. MOBILE APP BOOTSTRAP / VERSION CHECK CONFIG ---
@router.get("/mobile/app-config")
def get_mobile_app_config(app_type: str = Query("customer")):
    return {
        "app_type": app_type,
        "latest_version": "1.2.0",
        "min_supported_version": "1.0.0",
        "force_update": False,
        "maintenance_mode": False,
        "features": {
            "pwa_install_prompt": True,
            "biometric_login": True,
            "push_notifications": True
        }
    }