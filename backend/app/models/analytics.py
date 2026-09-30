from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class ProductView(Base):
    __tablename__ = "product_views"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ip_address = Column(String(45), nullable=True)
    device_type = Column(String(50), default="desktop") # 'mobile', 'desktop', 'tablet'
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class TrafficSession(Base):
    __tablename__ = "traffic_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, index=True, nullable=False)
    visitor_id = Column(String(100), index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    traffic_source = Column(String(100), default="direct") # 'google', 'facebook', 'direct', 'referral'
    device_type = Column(String(50), default="desktop")
    browser = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class GA4Config(Base):
    __tablename__ = "ga4_config"

    id = Column(Integer, primary_key=True, index=True)
    measurement_id = Column(String(100), nullable=False) # e.g. 'G-XXXXXXXXXX'
    api_secret = Column(String(255), nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)