from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any

class SEOMetadataBase(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    canonical_url: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    twitter_card: Optional[str] = None
    no_index: bool = False

class SEOMetadataCreate(SEOMetadataBase):
    entity_type: str
    entity_id: int

class SEOMetadataUpsert(SEOMetadataBase):
    entity_type: str
    entity_id: int

class SEOMetadataResponse(SEOMetadataBase):
    id: int
    entity_type: str
    entity_id: int

    model_config = ConfigDict(from_attributes=True)

class DynamicSitemapResponse(BaseModel):
    urls: List[str]

class RedirectRuleCreate(BaseModel):
    source_path: str
    target_path: str
    status_code: int = 301

class RedirectRuleResponse(BaseModel):
    id: int
    source_path: str
    target_path: str
    status_code: int

    model_config = ConfigDict(from_attributes=True)

class SchemaOrgProductResponse(BaseModel):
    product_id: int
    schema_data: Dict[str, Any]