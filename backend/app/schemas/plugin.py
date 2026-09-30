from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class PluginRegisterSchema(BaseModel):
    name: str
    slug: str
    version: Optional[str] = "1.0.0"
    description: Optional[str] = ""
    author: Optional[str] = ""
    plugin_type: str # payment, shipping, tax, marketing, analytics, ai, crm, custom
    settings: Optional[Dict[str, Any]] = {}

class PluginUpdateSchema(BaseModel):
    is_active: Optional[bool] = None
    version: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class HookRegisterSchema(BaseModel):
    plugin_id: int
    hook_name: str
    callback_endpoint: Optional[str] = ""
    priority: Optional[int] = 10

class HookTriggerRequest(BaseModel):
    hook_name: str
    payload: Dict[str, Any]

class PluginResponseSchema(BaseModel):
    id: int
    name: str
    slug: str
    version: str
    description: Optional[str]
    author: Optional[str]
    plugin_type: str
    is_active: bool
    settings: Optional[Dict[str, Any]]
    installed_at: datetime

    class Config:
        from_attributes = True