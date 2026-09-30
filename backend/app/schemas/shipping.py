from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ShippingZoneCreate(BaseModel):
    name: str
    description: Optional[str] = None
    cities: List[str] # ["Lahore", "Karachi"] or ["*"]
    countries: List[str] = ["Pakistan"]
    is_active: bool = True

class ShippingZoneResponse(ShippingZoneCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ShippingMethodCreate(BaseModel):
    zone_id: int
    name: str
    rate_type: str # 'flat_rate', 'free_shipping', 'weight_based', 'price_based', 'city_based'
    base_cost: float = 0.0
    min_order_amount: Optional[float] = None
    max_order_amount: Optional[float] = None
    cost_per_kg: float = 0.0
    min_weight_kg: float = 0.0
    max_weight_kg: Optional[float] = None
    estimated_days_min: int = 2
    estimated_days_max: int = 5
    is_active: bool = True

class ShippingMethodResponse(ShippingMethodCreate):
    id: int
    class Config:
        from_attributes = True

class ShippingRateQuery(BaseModel):
    city: str
    subtotal: float
    total_weight_kg: float = 1.0

class RateOptionResponse(BaseModel):
    method_id: int
    method_name: str
    shipping_cost: float
    estimated_days: str
    rate_type: str

class CreateShipmentRequest(BaseModel):
    order_id: int
    courier_code: str # 'tcs', 'leopards', 'mnp', 'standard'
    weight_kg: float = 1.0

class ShipmentTrackingLogResponse(BaseModel):
    id: int
    status: str
    location: Optional[str]
    description: str
    timestamp: datetime
    class Config:
        from_attributes = True

class ShipmentResponse(BaseModel):
    id: int
    order_id: int
    courier_code: str
    courier_name: str
    tracking_number: str
    status: str
    dispatch_date: Optional[datetime]
    estimated_delivery_date: Optional[datetime]
    weight_kg: float
    shipping_cost: float
    tracking_logs: List[ShipmentTrackingLogResponse] = []
    class Config:
        from_attributes = True