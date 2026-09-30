from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class AutomationRuleCreateSchema(BaseModel):
    name: str
    event_trigger: str # 'stock_low', 'abandoned_cart', 'order_delivered', 'customer_spend_threshold'
    conditions: Optional[Dict[str, Any]] = {}
    actions: List[Dict[str, Any]]
    is_active: Optional[bool] = True

class EventDispatchSchema(BaseModel):
    event_type: str # 'stock_low', 'abandoned_cart', 'order_delivered', 'customer_spend_threshold'
    payload: Dict[str, Any]