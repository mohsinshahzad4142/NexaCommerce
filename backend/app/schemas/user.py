from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserRegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    token: str # ID Token from Google Frontend SDK
    email: EmailStr
    full_name: str
    google_id: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    role: str

# --- Customer Profile Schemas ---
class UserProfileResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str]
    role: str
    is_vip: bool
    is_blocked: bool
    customer_group_id: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

# --- Wishlist Schemas ---
class WishlistAddRequest(BaseModel):
    product_id: int

class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    price: float
    created_at: datetime

# --- CRM Admin Schemas ---
class CustomerGroupCreate(BaseModel):
    name: str
    discount_percentage: float = 0.0
    description: Optional[str] = None

class CustomerGroupResponse(CustomerGroupCreate):
    id: int
    class Config:
        from_attributes = True

class AddCustomerNoteRequest(BaseModel):
    note: str

class CustomerNoteResponse(BaseModel):
    id: int
    admin_id: int
    note: str
    created_at: datetime
    class Config:
        from_attributes = True

class ActivityLogResponse(BaseModel):
    id: int
    activity_type: str
    description: str
    ip_address: Optional[str]
    timestamp: datetime
    class Config:
        from_attributes = True

class CustomerCRMDetailResponse(UserProfileResponse):
    cached_lifetime_value: float
    total_orders_count: int
    notes: List[CustomerNoteResponse] = []
    activities: List[ActivityLogResponse] = []