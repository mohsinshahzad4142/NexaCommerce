from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False) # e.g. 'WELCOME10', 'EID2026'
    description = Column(Text, nullable=True)

    # Discount Types: 'percentage', 'fixed', 'free_shipping', 'buy_x_get_y'
    discount_type = Column(String(50), nullable=False)
    value = Column(Float, default=0.0) # e.g., 15.0 for 15% or PKR 500 flat

    # Limits & Thresholds
    min_order_amount = Column(Float, nullable=True)
    max_discount_amount = Column(Float, nullable=True) # Capping for percentage discounts
    
    # Scoping Restrictions (Empty list means applicable to all)
    applicable_products = Column(JSON, nullable=False, default=[]) # [1, 5, 12]
    applicable_categories = Column(JSON, nullable=False, default=[]) # [3, 8]
    applicable_users = Column(JSON, nullable=False, default=[]) # Specific customer IDs

    # Targeting Flags
    is_first_order_only = Column(Boolean, default=False)
    
    # Buy X Get Y Parameters
    buy_x_qty = Column(Integer, default=0)
    get_y_qty = Column(Integer, default=0)
    get_y_product_id = Column(Integer, nullable=True)

    # Validity & Caps
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    usage_limit = Column(Integer, nullable=True) # Total global limit
    used_count = Column(Integer, default=0)
    per_user_limit = Column(Integer, default=1) # Limit per customer
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    usages = relationship("CouponUsage", back_populates="coupon", cascade="all, delete-orphan")


class CouponUsage(Base):
    __tablename__ = "coupon_usages"

    id = Column(Integer, primary_key=True, index=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="SET NULL"), nullable=True)
    discount_amount = Column(Float, nullable=False)
    used_at = Column(DateTime, default=datetime.utcnow)

    coupon = relationship("Coupon", back_populates="usages")