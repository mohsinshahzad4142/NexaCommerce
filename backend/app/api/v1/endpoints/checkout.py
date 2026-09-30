from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from app.db.database import get_db
from app.models.cart import Cart, CartItem
from app.models.coupon import Coupon
from app.models.order import Order, OrderItem, Address, PaymentTransaction
from app.models.product import Product

router = APIRouter()

# --- 1. PROCESS CHECKOUT & CREATE ORDER ---
@router.post("/checkout/process")
def process_checkout(
    cart_id: int,
    shipping_address_id: int,
    payment_method: str = "stripe",
    coupon_code: Optional[str] = None,
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty or not found")

    # Subtotal calculation
    subtotal = sum(item.price_at_addition * item.quantity for item in cart.items)
    discount = 0.0

    if coupon_code:
        coupon = db.query(Coupon).filter(Coupon.code == coupon_code, Coupon.is_active == True).first()
        if coupon:
            if coupon.discount_type == "percentage":
                discount = (subtotal * coupon.discount_value) / 100.0
            elif coupon.discount_type == "fixed":
                discount = coupon.discount_value

    total_amount = max(0.0, subtotal - discount)

    # Create Order
    order = Order(
        user_id=cart.user_id,
        total_amount=total_amount,
        shipping_address_id=shipping_address_id,
        status="pending",
        payment_status="pending"
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Move items from Cart to Order
    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.price_at_addition
        )
        db.add(order_item)

    # Clear Cart Items
    db.query(CartItem).filter(CartItem.cart_id == cart_id).delete()
    db.commit()

    return {
        "message": "Order created successfully",
        "order_id": order.id,
        "total_amount": total_amount,
        "status": order.status
    }