from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class FlashSale(Base):
    __tablename__ = "flash_sales"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False) # e.g. "Midnight Flash Sale 50% Off"
    banner_url = Column(String(255), nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("FlashSaleItem", back_populates="flash_sale", cascade="all, delete-orphan")


class FlashSaleItem(Base):
    __tablename__ = "flash_sale_items"

    id = Column(Integer, primary_key=True, index=True)
    flash_sale_id = Column(Integer, ForeignKey("flash_sales.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    sale_price = Column(Float, nullable=False)
    quantity_limit = Column(Integer, default=100) # Max stock reserved for flash sale
    sold_quantity = Column(Integer, default=0)

    flash_sale = relationship("FlashSale", back_populates="items")
    product = relationship("Product")


class GiftCard(Base):
    __tablename__ = "gift_cards"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False) # e.g., "GIFT-9823-X1"
    initial_balance = Column(Float, nullable=False)
    current_balance = Column(Float, nullable=False)
    currency = Column(String(10), default="PKR")
    expiry_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LoyaltyAccount(Base):
    __tablename__ = "loyalty_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    points_balance = Column(Integer, default=0)
    tier_level = Column(String(50), default="Bronze") # 'Bronze', 'Silver', 'Gold', 'Platinum'
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions = relationship("LoyaltyTransaction", back_populates="account", cascade="all, delete-orphan")


class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("loyalty_accounts.id", ondelete="CASCADE"), nullable=False)
    points = Column(Integer, nullable=False) # Positive for Earned, Negative for Redeemed
    type = Column(String(50), nullable=False) # 'earn_order', 'redeem_discount', 'bonus', 'referral'
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    account = relationship("LoyaltyAccount", back_populates="transactions")


class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    referrer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    referred_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    referral_code = Column(String(50), unique=True, nullable=False)
    reward_points = Column(Integer, default=500) # Points given on successful conversion
    status = Column(String(50), default="pending") # 'pending', 'converted', 'expired'
    created_at = Column(DateTime, default=datetime.utcnow)


class Affiliate(Base):
    __tablename__ = "affiliates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    affiliate_code = Column(String(50), unique=True, nullable=False) # e.g. "TECH_TECH_PK"
    commission_rate = Column(Float, default=5.0) # 5% commission on referred sales
    total_commission_earned = Column(Float, default=0.0)
    pending_payout = Column(Float, default=0.0)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class MarketingCampaign(Base):
    __tablename__ = "marketing_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    channel = Column(String(50), nullable=False) # 'email', 'sms', 'whatsapp', 'push'
    target_segment = Column(String(100), default="all") # 'all', 'vip', 'abandoned_cart', 'inactive_30d'
    subject_or_header = Column(String(255), nullable=True)
    message_body = Column(Text, nullable=False)
    status = Column(String(50), default="draft") # 'draft', 'scheduled', 'sent', 'failed'
    sent_count = Column(Integer, default=0)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)