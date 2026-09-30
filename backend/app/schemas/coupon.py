from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CouponCreate(BaseModel):
    code: str = Field(..., example="EID2026")
    description: Optional[str] = None
    discount_type: str # 'percentage', 'fixed', 'free_shipping', 'buy_x_get_y'
    value: float = 0.0
    min_order_amount: Optional[float] = None
    max_discount_amount: Optional[float] = None
    applicable_products: List[int] = []
    applicable_categories: List[int] = []
    applicable_users: List[int] = []
    is_first_order_only: bool = False
    buy_x_qty: int = 0
    get_y_qty: int = 0
    get_y_product_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    usage_limit: Optional[int] = None
    per_user_limit: int = 1
    is_active: bool = True

class CouponResponse(CouponCreate):
    id: int
    used_count: int
    created_at: datetime
    class Config:
        from_attributes = True

class CartItemForDiscount(BaseModel):
    product_id: int
    category_id: int
    unit_price: float
    quantity: int

class ValidateCouponRequest(BaseModel):
    coupon_code: str
    user_id: int
    cart_items: List[CartItemForDiscount]
    shipping_cost: float = 0.0

class CouponValidationResponse(BaseModel):
    is_valid: bool
    coupon_code: str
    discount_type: str
    discount_amount: float
    free_shipping: bool = False
    message: str