from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class ShippingZone(Base):
    __tablename__ = "shipping_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    cities = Column(JSON, nullable=False, default=[]) # e.g., ["Lahore", "Karachi", "Islamabad"] or ["*"] for nationwide
    countries = Column(JSON, nullable=False, default=["Pakistan"])
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    methods = relationship("ShippingMethod", back_populates="zone", cascade="all, delete-orphan")


class ShippingMethod(Base):
    __tablename__ = "shipping_methods"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("shipping_zones.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False) # e.g. 'Standard Courier', 'Express 24h', 'Heavy Goods'
    
    # Method Types: 'flat_rate', 'free_shipping', 'weight_based', 'price_based', 'city_based'
    rate_type = Column(String(50), nullable=False)
    
    base_cost = Column(Float, default=0.0)
    min_order_amount = Column(Float, nullable=True) # Used for free shipping or price-based tiers
    max_order_amount = Column(Float, nullable=True)
    
    cost_per_kg = Column(Float, default=0.0) # Used for weight_based
    min_weight_kg = Column(Float, default=0.0)
    max_weight_kg = Column(Float, nullable=True)

    estimated_days_min = Column(Integer, default=2)
    estimated_days_max = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)

    zone = relationship("ShippingZone", back_populates="methods")


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    courier_code = Column(String(50), nullable=False) # 'tcs', 'leopards', 'mnp', 'standard'
    courier_name = Column(String(100), nullable=False) # e.g., 'TCS Express'
    tracking_number = Column(String(100), unique=True, index=True, nullable=False)
    
    # Statuses: 'pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'
    status = Column(String(50), default="pending", index=True)
    
    dispatch_date = Column(DateTime, nullable=True)
    estimated_delivery_date = Column(DateTime, nullable=True)
    actual_delivery_date = Column(DateTime, nullable=True)
    
    weight_kg = Column(Float, default=1.0)
    shipping_cost = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tracking_logs = relationship("ShipmentTrackingLog", back_populates="shipment", cascade="all, delete-orphan")


class ShipmentTrackingLog(Base):
    __tablename__ = "shipment_tracking_logs"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False)
    location = Column(String(150), nullable=True) # e.g. "Lahore Central Hub"
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    shipment = relationship("Shipment", back_populates="tracking_logs")