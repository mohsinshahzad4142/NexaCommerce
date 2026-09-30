from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any

from app.core.dev_ops_engine import DevOpsEngine
from app.models.security import SecurityAuditLog
from sqlalchemy.orm import Session
from app.db.database import get_db

router = APIRouter()

# --- 1. HEALTH CHECK & DIAGNOSTICS ---
@router.get("/health")
def health_check():
    return DevOpsEngine.get_system_health()


# --- 2. TRIGGER AUTOMATED DATABASE BACKUP ---
@router.post("/backups/trigger")
def trigger_backup():
    return DevOpsEngine.create_database_backup()


# --- 3. SYSTEM AUDIT LOGS ---
@router.get("/audit-logs")
def get_system_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(SecurityAuditLog).order_by(SecurityAuditLog.id.desc()).limit(limit).all()
    return logs


# --- 4. ENVIRONMENT VARIABLE VERIFICATION ---
@router.get("/environment")
def get_environment_info():
    from app.core.config import settings
    return {
        "project": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
        "log_level": settings.LOG_LEVEL,
        "allowed_origins": settings.ALLOWED_ORIGINS
    }