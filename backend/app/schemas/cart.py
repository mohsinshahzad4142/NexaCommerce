from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CartItemCreate(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    variant_id: Optional[int] = None
    quantity: int
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True

class CouponCreate(BaseModel):
    code: str
    discount_type: str  # 'percentage' or 'fixed'
    discount_value: float
    min_order_amount: Optional[float] = 0.0
    max_discount_amount: Optional[float] = None
    is_free_shipping: bool = False
    usage_limit: Optional[int] = None
    expires_at: Optional[datetime] = None

class CouponResponse(CouponCreate):
    id: int
    is_active: bool
    used_count: int

    class Config:
        from_attributes = True

class ApplyCouponRequest(BaseModel):
    coupon_code: str

class CartMergeRequest(BaseModel):
    guest_session_id: str
    user_id: int

class CartSummaryResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    status: str
    items: List[CartItemResponse]
    subtotal: float
    discount_amount: float
    shipping_cost: float
    tax_amount: float
    grand_total: float
    coupon_code: Optional[str] = None
    is_free_shipping_applied: bool = False

    class Config:
        from_attributes = True