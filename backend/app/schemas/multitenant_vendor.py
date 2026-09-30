from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class StoreCreateSchema(BaseModel):
    name: str
    subdomain: str
    custom_domain: Optional[str] = None
    owner_id: int
    default_currency: str = "PKR"
    supported_currencies: List[str] = ["PKR", "USD", "EUR"]
    default_language: str = "ur"
    supported_languages: List[str] = ["ur", "en"]
    tax_rules: Dict[str, float] = {"PK": 18.0, "US": 8.5, "AE": 5.0}

class StoreResponseSchema(StoreCreateSchema):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class VendorCreateSchema(BaseModel):
    store_id: int
    user_id: int
    business_name: str
    slug: str
    commission_rate: float = 10.0
    bank_details: Optional[Dict[str, Any]] = None

class VendorResponseSchema(BaseModel):
    id: int
    store_id: int
    business_name: str
    slug: str
    commission_rate: float
    status: str
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True

class VendorPayoutRequestSchema(BaseModel):
    vendor_id: int
    amount: float
    currency: str = "PKR"
    payment_method: str = "bank_transfer"

class CurrencyConvertSchema(BaseModel):
    amount: float
    from_currency: str
    to_currency: str