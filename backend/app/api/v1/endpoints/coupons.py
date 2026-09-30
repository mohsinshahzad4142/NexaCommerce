from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.coupon import Coupon
from app.schemas.coupon import (
    CouponCreate, CouponResponse, ValidateCouponRequest, CouponValidationResponse
)
from app.services.discount_engine import DiscountEngine

router = APIRouter()

# --- 1. ADMIN COUPON MANAGEMENT ---
@router.post("/admin/coupons", response_model=CouponResponse)
def create_coupon(coupon_in: CouponCreate, db: Session = Depends(get_db)):
    existing = db.query(Coupon).filter(Coupon.code.ilike(coupon_in.code.strip())).first()
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")

    coupon = Coupon(**coupon_in.dict())
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.get("/admin/coupons", response_model=List[CouponResponse])
def list_all_coupons(db: Session = Depends(get_db)):
    return db.query(Coupon).order_by(Coupon.created_at.desc()).all()


@router.delete("/admin/coupons/{coupon_id}")
def delete_coupon(coupon_id: int, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    db.delete(coupon)
    db.commit()
    return {"message": "Coupon deleted successfully"}


# --- 2. CHECKOUT COUPON VALIDATION ---
@router.post("/coupons/validate", response_model=CouponValidationResponse)
def validate_cart_coupon(req: ValidateCouponRequest, db: Session = Depends(get_db)):
    return DiscountEngine.validate_and_calculate(
        db=db,
        code=req.coupon_code,
        user_id=req.user_id,
        cart_items=req.cart_items,
        shipping_cost=req.shipping_cost
    )