from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime

class APIKeyCreateSchema(BaseModel):
    name: str
    user_id: int
    scopes: Optional[List[str]] = ["read_only"]

class APIKeyResponseSchema(BaseModel):
    id: int
    name: str
    raw_api_key: Optional[str] = None # Returned only once upon creation
    prefix: str
    scopes: Optional[List[str]]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class WebhookSubscribeSchema(BaseModel):
    name: str
    target_url: str
    events: List[str]

class ThirdPartyConfigSchema(BaseModel):
    provider: str # 'whatsapp', 'meta_pixel', 'google_merchant', 'erp', 'accounting'
    is_enabled: bool
    config: Dict[str, Any]

class WhatsAppMessageSchema(BaseModel):
    recipient_phone: str
    template_name: str
    parameters: Dict[str, Any]

class MetaPixelEventSchema(BaseModel):
    event_name: str # e.g. 'Purchase', 'AddToCart', 'PageView'
    user_data: Dict[str, Any]
    custom_data: Dict[str, Any]