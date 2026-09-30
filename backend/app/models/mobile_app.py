from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class DeviceToken(Base):
    __tablename__ = "device_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    device_token = Column(String(500), nullable=False, unique=True, index=True) # FCM / APNS Push Token
    app_type = Column(String(20), nullable=False, index=True) # 'customer', 'admin', 'delivery', 'vendor'
    platform = Column(String(20), default="android") # 'android', 'ios', 'web_pwa'
    is_active = Column(Boolean, default=True)
    last_active_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class DeliveryRider(Base):
    __tablename__ = "delivery_riders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    vehicle_type = Column(String(50), default="bike") # 'bike', 'car', 'van'
    vehicle_number = Column(String(50), nullable=True)
    status = Column(String(20), default="offline", index=True) # 'available', 'busy', 'offline'
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    last_location_update = Column(DateTime, nullable=True)
    rating = Column(Float, default=5.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    assignments = relationship("DeliveryAssignment", back_populates="rider")
    location_logs = relationship("RiderLocationLog", back_populates="rider", cascade="all, delete-orphan")


class DeliveryAssignment(Base):
    __tablename__ = "delivery_assignments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    rider_id = Column(Integer, ForeignKey("delivery_riders.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(30), default="assigned", index=True) # 'assigned', 'accepted', 'picked_up', 'delivered', 'failed'
    notes = Column(Text, nullable=True)
    proof_of_delivery_url = Column(String(500), nullable=True)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    delivered_at = Column(DateTime, nullable=True)

    rider = relationship("DeliveryRider", back_populates="assignments")


class RiderLocationLog(Base):
    __tablename__ = "rider_location_logs"

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("delivery_riders.id", ondelete="CASCADE"), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    rider = relationship("DeliveryRider", back_populates="location_logs")