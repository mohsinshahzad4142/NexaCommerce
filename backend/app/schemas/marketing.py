from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Flash Sale Schemas ---
class FlashSaleItemCreate(BaseModel):
    product_id: int
    sale_price: float
    quantity_limit: int = 100

class FlashSaleCreate(BaseModel):
    title: str
    banner_url: Optional[str] = None
    start_time: datetime
    end_time: datetime
    items: List[FlashSaleItemCreate]

class FlashSaleResponse(BaseModel):
    id: int
    title: str
    banner_url: Optional[str]
    start_time: datetime
    end_time: datetime
    is_active: bool
    class Config:
        from_attributes = True

# --- Gift Card Schemas ---
class GiftCardCreate(BaseModel):
    initial_balance: float
    expiry_date: Optional[datetime] = None

class GiftCardRedeemRequest(BaseModel):
    code: str
    amount_to_use: float

class GiftCardResponse(BaseModel):
    id: int
    code: str
    initial_balance: float
    current_balance: float
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# --- Loyalty Schemas ---
class LoyaltyAccountResponse(BaseModel):
    user_id: int
    points_balance: int
    tier_level: str
    class Config:
        from_attributes = True

class RedeemPointsRequest(BaseModel):
    user_id: int
    points_to_redeem: int

# --- Notification Campaign Schemas ---
class SendNotificationCampaignRequest(BaseModel):
    title: str
    channel: str # 'email', 'sms', 'whatsapp', 'push'
    target_segment: str # 'all', 'vip', 'abandoned_cart'
    subject_or_header: Optional[str] = None
    message_body: str

class AbandonedCartRecoveryTrigger(BaseModel):
    user_id: int
    channel: str = "whatsapp" # 'whatsapp', 'email', 'sms'