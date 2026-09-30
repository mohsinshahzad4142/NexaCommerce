from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.category import Category, Brand
from app.schemas.category import CategoryCreate, CategoryResponse, BrandCreate, BrandResponse

router = APIRouter()

# --- CATEGORIES ---
@router.post("/categories/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories/", response_model=List[CategoryResponse])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Category).offset(skip).limit(limit).all()

# --- BRANDS ---
@router.post("/brands/", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand(brand: BrandCreate, db: Session = Depends(get_db)):
    db_brand = Brand(**brand.dict())
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand

@router.get("/brands/", response_model=List[BrandResponse])
def get_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Brand).offset(skip).limit(limit).all()