from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    subdomain = Column(String(100), unique=True, index=True, nullable=False) # e.g. store1.nexacommerce.com
    custom_domain = Column(String(255), unique=True, index=True, nullable=True) # e.g. www.mystore.com
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    default_currency = Column(String(10), default="PKR") # e.g., PKR, USD, EUR, AED
    supported_currencies = Column(JSON, default=["PKR", "USD", "EUR"])
    default_language = Column(String(10), default="ur") # e.g., ur, en, ar
    supported_languages = Column(JSON, default=["ur", "en"])
    multi_country_tax_enabled = Column(Boolean, default=True)
    tax_rules = Column(JSON, default={"PK": 18.0, "US": 8.5, "AE": 5.0}) # Country code to Tax %
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendors = relationship("Vendor", back_populates="store", cascade="all, delete-orphan")


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    business_name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    logo_url = Column(String(500), nullable=True)
    commission_rate = Column(Float, default=10.0) # Percentage commission e.g. 10%
    status = Column(String(20), default="pending") # 'pending', 'approved', 'suspended'
    bank_details = Column(JSON, nullable=True) # IBAN, Account Title, Bank Name
    rating = Column(Float, default=5.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    store = relationship("Store", back_populates="vendors")
    commissions = relationship("VendorCommission", back_populates="vendor")
    payouts = relationship("VendorPayout", back_populates="vendor")


class VendorCommission(Base):
    __tablename__ = "vendor_commissions"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    order_id = Column(Integer, nullable=False, index=True)
    order_item_id = Column(Integer, nullable=False)
    item_amount = Column(Float, nullable=False)
    commission_rate = Column(Float, nullable=False)
    commission_amount = Column(Float, nullable=False) # Platform share
    vendor_payout_amount = Column(Float, nullable=False) # Vendor share
    status = Column(String(20), default="pending") # 'pending', 'eligible', 'paid'
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor", back_populates="commissions")


class VendorPayout(Base):
    __tablename__ = "vendor_payouts"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="PKR")
    payment_method = Column(String(50), nullable=False) # 'bank_transfer', 'easypaisa', 'stripe'
    transaction_reference = Column(String(255), nullable=True)
    status = Column(String(20), default="processing") # 'processing', 'completed', 'failed'
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor", back_populates="payouts")


class ExchangeRate(Base):
    __tablename__ = "exchange_rates"

    id = Column(Integer, primary_key=True, index=True)
    base_currency = Column(String(10), default="USD", nullable=False)
    target_currency = Column(String(10), nullable=False)
    rate = Column(Float, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)