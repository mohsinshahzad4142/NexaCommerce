from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PermissionSchema(BaseModel):
    id: int
    resource: str
    action: str
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class RoleCreateSchema(BaseModel):
    name: str
    description: Optional[str] = None
    permission_ids: List[int]

class RoleResponseSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_system_role: bool
    permissions: List[PermissionSchema]
    created_at: datetime

    class Config:
        from_attributes = True

class UserRoleAssignSchema(BaseModel):
    user_id: int
    role_ids: List[int]

class UserPermissionsSummaryResponse(BaseModel):
    user_id: int
    roles: List[str]
    permissions: List[str]