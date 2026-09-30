from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User2FA(Base):
    __tablename__ = "user_2fa"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    secret_key = Column(String(100), nullable=False)
    is_enabled = Column(Boolean, default=False)
    backup_codes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LoginActivityLog(Base):
    __tablename__ = "login_activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    status = Column(String(30), default="success") # 'success', 'failed'
    login_at = Column(DateTime, default=datetime.utcnow)


class SecurityAuditLog(Base):
    __tablename__ = "security_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False)
    performed_by = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class DatabaseBackupRecord(Base):
    __tablename__ = "database_backup_records"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    backup_path = Column(String(500), nullable=False)
    file_size_mb = Column(Float, nullable=False)
    status = Column(String(50), default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)