from datetime import datetime
from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models.coupon import Coupon, CouponUsage
from app.models.order import Order
from app.schemas.coupon import CartItemForDiscount, CouponValidationResponse

class DiscountEngine:
    @staticmethod
    def validate_and_calculate(
        db: Session,
        code: str,
        user_id: int,
        cart_items: List[CartItemForDiscount],
        shipping_cost: float = 0.0
    ) -> CouponValidationResponse:
        
        coupon = db.query(Coupon).filter(
            Coupon.code.ilike(code.strip()),
            Coupon.is_active == True
        ).first()

        if not coupon:
            return CouponValidationResponse(
                is_valid=False, coupon_code=code, discount_type="none",
                discount_amount=0.0, message="Invalid coupon code"
            )

        now = datetime.utcnow()
        if coupon.start_date and now < coupon.start_date:
            return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message="Coupon is not yet active")
        if coupon.end_date and now > coupon.end_date:
            return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message="Coupon has expired")

        # Global Usage Cap
        if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
            return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message="Coupon usage limit reached")

        # Per-User Limit Check
        user_usage_count = db.query(CouponUsage).filter(
            CouponUsage.coupon_id == coupon.id,
            CouponUsage.user_id == user_id
        ).count()

        if user_usage_count >= coupon.per_user_limit:
            return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message="You have reached the maximum usage limit for this coupon")

        # User Specific Restriction
        if coupon.applicable_users and user_id not in coupon.applicable_users:
            return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message="Coupon is not valid for your account")

        # First Order Only Rule
        if coupon.is_first_order_only:
            previous_orders = db.query(Order).filter(Order.user_id == user_id).count()
            if previous_orders > 0:
                return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message="Coupon is valid for first order only")

        # Calculate Subtotal
        cart_subtotal = sum(item.unit_price * item.quantity for item in cart_items)

        if coupon.min_order_amount and cart_subtotal < coupon.min_order_amount:
            return CouponValidationResponse(
                is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0,
                message=f"Minimum order amount of PKR {coupon.min_order_amount} required"
            )

        # Scoped Items Filter
        eligible_subtotal = 0.0
        eligible_items_count = 0
        
        for item in cart_items:
            is_product_matched = not coupon.applicable_products or item.product_id in coupon.applicable_products
            is_category_matched = not coupon.applicable_categories or item.category_id in coupon.applicable_categories
            
            if is_product_matched and is_category_matched:
                eligible_subtotal += item.unit_price * item.quantity
                eligible_items_count += item.quantity

        if eligible_subtotal == 0.0 and (coupon.applicable_products or coupon.applicable_categories):
            return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message="No eligible items in cart for this coupon")

        discount_amount = 0.0
        free_shipping = False

        if coupon.discount_type == "percentage":
            discount_amount = (eligible_subtotal * coupon.value) / 100.0
            if coupon.max_discount_amount and discount_amount > coupon.max_discount_amount:
                discount_amount = coupon.max_discount_amount

        elif coupon.discount_type == "fixed":
            discount_amount = min(coupon.value, eligible_subtotal)

        elif coupon.discount_type == "free_shipping":
            free_shipping = True
            discount_amount = shipping_cost

        elif coupon.discount_type == "buy_x_get_y":
            if eligible_items_count >= coupon.buy_x_qty:
                target_item = next((i for i in cart_items if i.product_id == coupon.get_y_product_id), None)
                if target_item:
                    discount_amount = target_item.unit_price * coupon.get_y_qty
                else:
                    return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message=f"Buy X Get Y item (Product #{coupon.get_y_product_id}) not found in cart")
            else:
                return CouponValidationResponse(is_valid=False, coupon_code=code, discount_type="none", discount_amount=0.0, message=f"Requires at least {coupon.buy_x_qty} items in cart")

        return CouponValidationResponse(
            is_valid=True,
            coupon_code=coupon.code,
            discount_type=coupon.discount_type,
            discount_amount=round(discount_amount, 2),
            free_shipping=free_shipping,
            message="Coupon applied successfully!"
        )