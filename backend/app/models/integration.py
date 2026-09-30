from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    key_hash = Column(String(255), nullable=False, unique=True, index=True)
    prefix = Column(String(16), nullable=False) # e.g. "nexa_live_..."
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scopes = Column(JSON, nullable=True) # e.g. ["orders:read", "products:write", "webhooks:manage"]
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class WebhookSubscription(Base):
    __tablename__ = "webhook_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    target_url = Column(String(500), nullable=False)
    secret = Column(String(255), nullable=False) # Used for HMAC SHA256 Signature Verification
    events = Column(JSON, nullable=False) # e.g. ["order.created", "product.updated", "customer.registered"]
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    logs = relationship("WebhookLog", back_populates="subscription", cascade="all, delete-orphan")


class WebhookLog(Base):
    __tablename__ = "webhook_logs"

    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("webhook_subscriptions.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(100), nullable=False, index=True)
    payload = Column(JSON, nullable=False)
    response_status = Column(Integer, nullable=True)
    response_body = Column(Text, nullable=True)
    status = Column(String(20), default="pending") # 'success', 'failed', 'retrying'
    attempts = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    subscription = relationship("WebhookSubscription", back_populates="logs")


class ThirdPartyIntegration(Base):
    __tablename__ = "third_party_integrations"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String(100), nullable=False, unique=True, index=True) # 'whatsapp', 'meta_pixel', 'google_merchant', 'erp', 'accounting'
    is_enabled = Column(Boolean, default=False)
    config = Column(JSON, nullable=True, default={}) # Stores API credentials, access tokens, Pixel IDs, Secrets
    last_synced_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)