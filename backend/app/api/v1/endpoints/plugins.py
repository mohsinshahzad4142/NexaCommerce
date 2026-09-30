from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel

router = APIRouter()

class PluginRegisterSchema(BaseModel):
    name: str
    version: str
    description: Optional[str] = None

class PluginResponseSchema(BaseModel):
    id: int
    name: str
    version: str
    status: str = "active"

@router.get("/", response_model=List[PluginResponseSchema])
def list_plugins(plugin_type: Optional[str] = Query(None)):
    return []

@router.post("/register", response_model=PluginResponseSchema, status_code=status.HTTP_201_CREATED)
def register_plugin(plugin: PluginRegisterSchema):
    return {"id": 1, "name": plugin.name, "version": plugin.version, "status": "active"}