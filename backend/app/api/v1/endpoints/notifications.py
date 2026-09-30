from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.database import get_db
from app.schemas.notifications import (
    NotificationTemplateSchema, NotificationTemplateCreate,
    TriggerNotificationRequest, NotificationLogSchema
)
from app.services.notification_service import NotificationService, SUPPORTED_EVENTS
from app.models.notifications import NotificationTemplate, NotificationLog

router = APIRouter()

# --- 1. SEED DEFAULT NOTIFICATION TEMPLATES ---
@router.post("/admin/notifications/seed")
def seed_templates(db: Session = Depends(get_db)):
    NotificationService.seed_default_templates(db)
    return {"message": "Default notification templates seeded successfully."}


# --- 2. LIST & MANAGE NOTIFICATION TEMPLATES ---
@router.get("/admin/notifications/templates", response_model=List[NotificationTemplateSchema])
def list_templates(db: Session = Depends(get_db)):
    return db.query(NotificationTemplate).all()


@router.post("/admin/notifications/templates", response_model=NotificationTemplateSchema)
def create_or_update_template(tmpl_in: NotificationTemplateCreate, db: Session = Depends(get_db)):
    existing = db.query(NotificationTemplate).filter(
        NotificationTemplate.event_type == tmpl_in.event_type,
        NotificationTemplate.channel == tmpl_in.channel
    ).first()

    if existing:
        existing.subject_template = tmpl_in.subject_template
        existing.body_template = tmpl_in.body_template
        existing.is_active = tmpl_in.is_active
        db.commit()
        db.refresh(existing)
        return existing

    new_tmpl = NotificationTemplate(**tmpl_in.model_dump())
    db.add(new_tmpl)
    db.commit()
    db.refresh(new_tmpl)
    return new_tmpl


# --- 3. TRIGGER NOTIFICATION EVENT (CORE ENGINE API) ---
@router.post("/notifications/trigger-event")
def trigger_notification_event(req: TriggerNotificationRequest, db: Session = Depends(get_db)):
    try:
        dispatch_results = NotificationService.dispatch_event(
            db=db,
            event_type=req.event_type,
            variables=req.variables,
            recipient_email=req.recipient_email,
            recipient_phone=req.recipient_phone,
            fcm_device_token=req.fcm_device_token,
            user_id=req.user_id
        )
        return {
            "event_type": req.event_type,
            "dispatched_channels": dispatch_results
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


# --- 4. VIEW NOTIFICATION AUDIT LOGS ---
@router.get("/admin/notifications/logs", response_model=List[NotificationLogSchema])
def list_notification_logs(
    channel: str = Query(None),
    event_type: str = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(NotificationLog)
    if channel:
        q = q.filter(NotificationLog.channel == channel)
    if event_type:
        q = q.filter(NotificationLog.event_type == event_type)
    return q.order_by(NotificationLog.sent_at.desc()).limit(100).all()