from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- VARIANT SCHEMAS ---
class ProductVariantBase(BaseModel):
    sku: str
    attributes: Dict[str, Any]
    regular_price: Optional[float] = None
    sale_price: Optional[float] = None
    stock_quantity: int = 0
    image_url: Optional[str] = None

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantResponse(ProductVariantBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True

# --- IMAGE SCHEMAS ---
class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    display_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True

# --- SPECIFICATION SCHEMAS ---
class ProductSpecificationBase(BaseModel):
    key: str
    value: str

class ProductSpecificationCreate(ProductSpecificationBase):
    pass

class ProductSpecificationResponse(ProductSpecificationBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True

# --- PRODUCT SCHEMAS ---
class ProductBase(BaseModel):
    name: str
    slug: str
    sku: str
    barcode: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    regular_price: float
    sale_price: Optional[float] = None
    flash_sale_price: Optional[float] = None
    stock_quantity: int = 0
    low_stock_threshold: int = 5
    allow_backorders: bool = False
    weight: Optional[float] = None
    dimensions: Optional[Dict[str, Any]] = None
    status: str = "draft"  # draft, published, scheduled
    scheduled_at: Optional[datetime] = None
    is_featured: bool = False
    featured_image: Optional[str] = None
    video_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    category_id: Optional[int] = None
    brand_id: Optional[int] = None

class ProductCreate(ProductBase):
    images: Optional[List[ProductImageCreate]] = []
    variants: Optional[List[ProductVariantCreate]] = []
    specifications: Optional[List[ProductSpecificationCreate]] = []
    tags: Optional[List[str]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    regular_price: Optional[float] = None
    sale_price: Optional[float] = None
    flash_sale_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    allow_backorders: Optional[bool] = None
    weight: Optional[float] = None
    dimensions: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    is_featured: Optional[bool] = None
    featured_image: Optional[str] = None
    video_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    canonical_url: Optional[str] = None
    category_id: Optional[int] = None
    brand_id: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    images: List[ProductImageResponse] = []
    variants: List[ProductVariantResponse] = []
    specifications: List[ProductSpecificationResponse] = []

    class Config:
        from_attributes = True

# --- BULK SCHEMAS ---
class BulkStatusUpdate(BaseModel):
    product_ids: List[int]
    status: str  # draft, published, scheduled

class BulkPriceUpdate(BaseModel):
    product_ids: List[int]
    percentage_change: Optional[float] = None  # e.g., +10 or -5
    fixed_regular_price: Optional[float] = None

class BulkStockUpdate(BaseModel):
    product_ids: List[int]
    stock_quantity: int

class BulkCategoryAssign(BaseModel):
    product_ids: List[int]
    category_id: int

class BulkDeleteRequest(BaseModel):
    product_ids: List[int]