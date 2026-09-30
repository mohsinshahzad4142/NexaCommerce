from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from datetime import datetime
from app.db.database import Base

class SEOMetadata(Base):
    __tablename__ = "seo_metadata"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False, index=True) # 'product', 'category', 'page'
    entity_id = Column(Integer, nullable=False, index=True)
    
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    canonical_url = Column(String(255), nullable=True)
    
    # Open Graph & Social Cards
    og_title = Column(String(255), nullable=True)
    og_description = Column(Text, nullable=True)
    og_image = Column(String(255), nullable=True)
    twitter_card = Column(String(50), default="summary_large_image")
    
    created_at = Column(DateTime, default=datetime.utcnow)


class RedirectRule(Base):
    __tablename__ = "redirect_rules"

    id = Column(Integer, primary_key=True, index=True)
    source_path = Column(String(255), unique=True, index=True, nullable=False) # e.g. '/old-product-url'
    target_path = Column(String(255), nullable=False) # e.g. '/products/new-product-slug'
    status_code = Column(Integer, default=301) # 301 Permanent or 302 Temporary
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)