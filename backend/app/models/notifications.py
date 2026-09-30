from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from datetime import datetime
from app.db.database import Base

class NotificationTemplate(Base):
    __tablename__ = "notification_templates"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False, index=True) # 'new_order', 'order_shipped', 'password_reset', etc.
    channel = Column(String(20), nullable=False, index=True)    # 'email', 'sms', 'whatsapp', 'push'
    subject_template = Column(String(255), nullable=True)
    body_template = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class NotificationLog(Base):
    __tablename__ = "notification_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    channel = Column(String(20), nullable=False, index=True)
    recipient = Column(String(255), nullable=False) # Email address, Phone Number, or FCM Push Token
    subject = Column(String(255), nullable=True)
    body = Column(Text, nullable=False)
    status = Column(String(20), default="sent", index=True) # 'sent', 'failed', 'queued'
    error_message = Column(Text, nullable=True)
    sent_at = Column(DateTime, default=datetime.utcnow, index=True)