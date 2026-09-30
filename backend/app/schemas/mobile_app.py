from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DeviceTokenRegisterSchema(BaseModel):
    user_id: int
    device_token: str
    app_type: str # 'customer', 'admin', 'delivery', 'vendor'
    platform: Optional[str] = "android"

class PushNotificationSendSchema(BaseModel):
    app_type: str # 'customer', 'admin', 'delivery', 'vendor'
    title: str
    body: str
    data_payload: Optional[Dict[str, Any]] = {}
    target_user_id: Optional[int] = None

class RiderLocationUpdateSchema(BaseModel):
    rider_id: int
    lat: float
    lng: float

class DeliveryStatusUpdateSchema(BaseModel):
    assignment_id: int
    status: str # 'accepted', 'picked_up', 'delivered', 'failed'
    notes: Optional[str] = ""
    proof_of_delivery_url: Optional[str] = ""

class MobileAppConfigSchema(BaseModel):
    app_type: str
    current_version: str = "1.0.0"
    force_update: bool = False
    maintenance_mode: bool = False