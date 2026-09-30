from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    session_id = Column(String(255), nullable=True, index=True)
    
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    address_line1 = Column(Text, nullable=False)
    address_line2 = Column(Text, nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=False)
    country = Column(String(100), default="Pakistan")
    address_type = Column(String(20), default="shipping")
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, nullable=True, index=True)
    guest_email = Column(String(255), nullable=True)
    guest_phone = Column(String(50), nullable=True)

    shipping_address_json = Column(Text, nullable=False)
    billing_address_json = Column(Text, nullable=False)

    # Statuses: 'pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded', 'failed'
    status = Column(String(50), default="pending", index=True)
    payment_status = Column(String(50), default="unpaid")
    payment_method = Column(String(50), nullable=False)
    shipping_method = Column(String(100), default="standard")

    # Fulfillment / Shipping Details
    tracking_number = Column(String(100), nullable=True)
    courier_name = Column(String(100), nullable=True)

    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    shipping_cost = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    grand_total = Column(Float, nullable=False)
    coupon_code = Column(String(50), nullable=True)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    transactions = relationship("PaymentTransaction", back_populates="order", cascade="all, delete-orphan")
    order_notes = relationship("OrderNote", back_populates="order", cascade="all, delete-orphan")
    timeline = relationship("OrderTimeline", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    variant_id = Column(Integer, ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)

    product_name = Column(String(255), nullable=False)
    sku = Column(String(100), nullable=True)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    gateway = Column(String(50), nullable=False)
    transaction_id = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="PKR")
    raw_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="transactions")


class OrderNote(Base):
    __tablename__ = "order_notes"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    author_role = Column(String(50), default="admin") # 'admin', 'system', 'customer'
    note_text = Column(Text, nullable=False)
    is_customer_visible = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="order_notes")


class OrderTimeline(Base):
    __tablename__ = "order_timeline"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    status_from = Column(String(50), nullable=True)
    status_to = Column(String(50), nullable=False)
    comment = Column(Text, nullable=True)
    changed_by = Column(String(100), default="System/Admin")
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="timeline")