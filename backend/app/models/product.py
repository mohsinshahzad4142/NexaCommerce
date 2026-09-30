from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)

class ProductTag(Base):
    __tablename__ = "product_tags"

    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    barcode = Column(String(100), nullable=True)
    
    short_description = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    
    regular_price = Column(Float, nullable=False)
    sale_price = Column(Float, nullable=True)
    flash_sale_price = Column(Float, nullable=True)
    stock_quantity = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=5)
    allow_backorders = Column(Boolean, default=False)
    
    weight = Column(Float, nullable=True)
    dimensions = Column(JSON, nullable=True)
    
    status = Column(String(50), default="draft")
    scheduled_at = Column(DateTime, nullable=True)
    is_featured = Column(Boolean, default=False)
    
    featured_image = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(String(255), nullable=True)
    canonical_url = Column(String(500), nullable=True)
    
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    brand = relationship("Brand", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    specifications = relationship("ProductSpecification", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("ProductReview", back_populates="product", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary="product_tags", backref="products")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)

    product = relationship("Product", back_populates="images")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    sku = Column(String(100), unique=True, index=True, nullable=False)
    attributes = Column(JSON, nullable=False)
    regular_price = Column(Float, nullable=True)
    sale_price = Column(Float, nullable=True)
    stock_quantity = Column(Integer, default=0)
    image_url = Column(String(500), nullable=True)

    product = relationship("Product", back_populates="variants")


class ProductSpecification(Base):
    __tablename__ = "product_specifications"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    key = Column(String(100), nullable=False)
    value = Column(String(255), nullable=False)

    product = relationship("Product", back_populates="specifications")


class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    customer_name = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="reviews")