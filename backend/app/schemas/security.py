from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class TwoFactorSetupResponse(BaseModel):
    totp_secret: str
    qr_code_url: str
    backup_codes: List[str]

class TwoFactorVerifyRequest(BaseModel):
    user_id: int
    totp_code: str

class LoginActivitySchema(BaseModel):
    id: int
    user_id: Optional[int]
    email: str
    ip_address: str
    user_agent: Optional[str]
    device_type: str
    status: str
    failure_reason: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

class AuditLogSchema(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    resource: str
    ip_address: str
    request_payload: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

class BackupRequestSchema(BaseModel):
    destination: str = "local" # 'local' or 's3'