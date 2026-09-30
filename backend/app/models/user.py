from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class CustomerGroup(Base):
    __tablename__ = "customer_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True) # e.g., 'Retail', 'Wholesale', 'VIP', 'VIP Diamond'
    discount_percentage = Column(Float, default=0.0)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    customers = relationship("User", back_populates="group")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True) # Optional for pure OAuth users
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(50), default="customer") # 'customer', 'manager', 'admin'
    
    # Social Login Auth Providers
    google_id = Column(String(255), nullable=True, unique=True)
    auth_provider = Column(String(50), default="email") # 'email', 'google', 'facebook'
    
    # Customer Status & Grouping
    is_active = Column(Boolean, default=True)
    is_blocked = Column(Boolean, default=False)
    is_vip = Column(Boolean, default=False)
    customer_group_id = Column(Integer, ForeignKey("customer_groups.id", ondelete="SET NULL"), nullable=True)
    
    # Calculated Analytics
    cached_lifetime_value = Column(Float, default=0.0)
    total_orders_count = Column(Integer, default=0)
    
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    group = relationship("CustomerGroup", back_populates="customers")
    notes = relationship("CustomerNote", back_populates="customer", cascade="all, delete-orphan")
    activities = relationship("CustomerActivityLog", back_populates="customer", cascade="all, delete-orphan")
    wishlist_items = relationship("Wishlist", back_populates="customer", cascade="all, delete-orphan")


class CustomerNote(Base):
    __tablename__ = "customer_notes"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    admin_id = Column(Integer, nullable=False)
    note = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("User", back_populates="notes")


class CustomerActivityLog(Base):
    __tablename__ = "customer_activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_type = Column(String(100), nullable=False) # 'login', 'order_placed', 'wishlist_add', 'profile_update'
    description = Column(Text, nullable=False)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    customer = relationship("User", back_populates="activities")


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("User", back_populates="wishlist_items")
    product = relationship("Product")