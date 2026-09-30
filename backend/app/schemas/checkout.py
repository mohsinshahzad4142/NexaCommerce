from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class AddressBase(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str = "Pakistan"
    address_type: str = "shipping"
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: int

    class Config:
        from_attributes = True

class CheckoutRequest(BaseModel):
    # Guest or Saved Address
    shipping_address: AddressBase
    billing_address: Optional[AddressBase] = None # Uses shipping if None
    use_shipping_for_billing: bool = True

    guest_email: Optional[EmailStr] = None
    guest_phone: Optional[str] = None

    shipping_method: str = "standard"
    payment_method: str  # 'cod', 'stripe', 'bank_transfer', 'wallet'
    payment_data: Optional[Dict[str, Any]] = {}
    notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int]
    variant_id: Optional[int]
    product_name: str
    sku: Optional[str]
    unit_price: float
    quantity: int
    total_price: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: Optional[int]
    guest_email: Optional[str]
    guest_phone: Optional[str]
    status: str
    payment_status: str
    payment_method: str
    shipping_method: str
    subtotal: float
    discount_amount: float
    shipping_cost: float
    tax_amount: float
    grand_total: float
    coupon_code: Optional[str]
    notes: Optional[str]
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True