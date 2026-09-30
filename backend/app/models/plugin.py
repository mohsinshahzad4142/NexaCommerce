from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Plugin(Base):
    __tablename__ = "plugins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    version = Column(String(50), nullable=False, default="1.0.0")
    description = Column(Text, nullable=True)
    author = Column(String(255), nullable=True)
    plugin_type = Column(String(50), nullable=False, index=True) # 'payment', 'shipping', 'tax', 'marketing', 'analytics', 'ai', 'crm', 'custom'
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, nullable=True, default={})
    installed_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hooks = relationship("PluginHook", back_populates="plugin", cascade="all, delete-orphan")


class PluginHook(Base):
    __tablename__ = "plugin_hooks"

    id = Column(Integer, primary_key=True, index=True)
    plugin_id = Column(Integer, ForeignKey("plugins.id", ondelete="CASCADE"), nullable=False)
    hook_name = Column(String(255), nullable=False, index=True) # e.g. 'order.created', 'checkout.payment_gateways', 'cart.calculate_tax'
    callback_endpoint = Column(String(500), nullable=True) # Webhook or internal plugin service endpoint
    priority = Column(Integer, default=10)
    is_enabled = Column(Boolean, default=True)

    plugin = relationship("Plugin", back_populates="hooks")