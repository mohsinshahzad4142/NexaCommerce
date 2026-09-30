from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime

class NotificationTemplateSchema(BaseModel):
    id: int
    event_type: str
    channel: str
    subject_template: Optional[str] = None
    body_template: str
    is_active: bool

    class Config:
        from_attributes = True

class NotificationTemplateCreate(BaseModel):
    event_type: str # 'new_order', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled', 'payment_received', 'payment_failed', 'low_stock', 'new_customer', 'password_reset'
    channel: str    # 'email', 'sms', 'whatsapp', 'push'
    subject_template: Optional[str] = None
    body_template: str
    is_active: bool = True

class TriggerNotificationRequest(BaseModel):
    event_type: str
    recipient_email: Optional[EmailStr] = None
    recipient_phone: Optional[str] = None # E.164 format: +923001234567
    fcm_device_token: Optional[str] = None
    user_id: Optional[int] = None
    variables: Dict[str, Any] # e.g. {"customer_name": "Mohsin", "order_number": "NEXA-1001", "amount": "Rs. 2,500"}

class NotificationLogSchema(BaseModel):
    id: int
    user_id: Optional[int]
    event_type: str
    channel: str
    recipient: str
    subject: Optional[str]
    body: str
    status: str
    error_message: Optional[str]
    sent_at: datetime

    class Config:
        from_attributes = True