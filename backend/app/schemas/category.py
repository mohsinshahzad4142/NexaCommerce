from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BrandBase(BaseModel):
    name: str
    slug: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True