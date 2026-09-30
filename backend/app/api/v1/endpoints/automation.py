from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.database import get_db
from app.schemas.automation import AutomationRuleCreateSchema, EventDispatchSchema
from app.models.automation import AutomationRule, AutomationLog
from app.core.automation_engine import EventDrivenAutomationEngine

router = APIRouter()

# --- 1. CREATE AUTOMATION WORKFLOW RULE ---
@router.post("/rules")
def create_automation_rule(req: AutomationRuleCreateSchema, db: Session = Depends(get_db)):
    rule = AutomationRule(
        name=req.name,
        event_trigger=req.event_trigger,
        conditions=req.conditions,
        actions=req.actions,
        is_active=req.is_active if req.is_active is not None else True
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


# --- 2. LIST ALL AUTOMATION RULES ---
@router.get("/rules")
def list_automation_rules(db: Session = Depends(get_db)):
    return db.query(AutomationRule).order_by(AutomationRule.id.desc()).all()


# --- 3. EVENT DISPATCHER API (TESTING EVENT PIPELINE) ---
@router.post("/events/dispatch")
def dispatch_event(req: EventDispatchSchema, db: Session = Depends(get_db)):
    results = EventDrivenAutomationEngine.dispatch_event(
        db=db,
        event_type=req.event_type,
        payload=req.payload
    )
    return {
        "event_type": req.event_type,
        "processed_rules_count": len(results),
        "execution_results": results
    }


# --- 4. SEED PRE-BUILT E-COMMERCE WORKFLOW RULES ---
@router.post("/seed-default-rules")
def seed_default_automation_rules(db: Session = Depends(get_db)):
    default_rules = [
        {
            "name": "Low Stock Admin Alert",
            "event_trigger": "stock_low",
            "conditions": {"stock_limit": 5},
            "actions": [{"type": "notify_admin"}]
        },
        {
            "name": "Abandoned Cart Recovery Email (2 Hours)",
            "event_trigger": "abandoned_cart",
            "conditions": {"idle_hours": 2},
            "actions": [{"type": "send_abandoned_cart_email"}]
        },
        {
            "name": "Post-Delivery Product Review Request",
            "event_trigger": "order_delivered",
            "conditions": {},
            "actions": [{"type": "send_review_request"}]
        },
        {
            "name": "Automatic VIP Customer Upgrade ($500+ Spend)",
            "event_trigger": "customer_spend_threshold",
            "conditions": {"spent_amount": 500.0},
            "actions": [{"type": "upgrade_vip_customer"}]
        }
    ]

    created = []
    for r in default_rules:
        rule = AutomationRule(**r)
        db.add(rule)
        created.append(r["name"])
    
    db.commit()
    return {"message": "Default automation workflows initialized.", "rules": created}


# --- 5. AUTOMATION AUDIT LOGS ---
@router.get("/logs")
def get_automation_logs(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(AutomationLog).order_by(AutomationLog.id.desc()).limit(limit).all()