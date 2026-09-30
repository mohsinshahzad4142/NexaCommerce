from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.models.cart import Cart, CartItem
from app.models.coupon import Coupon
from app.models.product import Product

router = APIRouter()

# --- 1. GET OR CREATE CART ---
@router.get("/cart")
def get_cart(session_id: Optional[str] = None, user_id: Optional[int] = None, db: Session = Depends(get_db)):
    cart = None
    if user_id:
        cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    elif session_id:
        cart = db.query(Cart).filter(Cart.session_id == session_id).first()

    if not cart:
        cart = Cart(user_id=user_id, session_id=session_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart


# --- 2. ADD ITEM TO CART ---
@router.post("/cart/items")
def add_to_cart(cart_id: int, product_id: int, quantity: int = 1, variant_id: Optional[int] = None, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart_id,
        CartItem.product_id == product_id,
        CartItem.variant_id == variant_id
    ).first()

    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            cart_id=cart_id,
            product_id=product_id,
            variant_id=variant_id,
            quantity=quantity,
            price_at_addition=product.price
        )
        db.add(cart_item)

    db.commit()
    return {"message": "Item added to cart successfully"}


# --- 3. REMOVE ITEM FROM CART ---
@router.delete("/cart/items/{item_id}")
def remove_cart_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}


# --- 4. APPLY COUPON CODE ---
@router.post("/cart/apply-coupon")
def apply_coupon(code: str, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()
    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid or inactive coupon code")

    return {
        "message": "Coupon applied successfully",
        "code": coupon.code,
        "discount_type": coupon.discount_type,
        "discount_value": coupon.discount_value
    }