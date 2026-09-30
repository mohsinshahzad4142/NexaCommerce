from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime

from app.db.database import get_db
from app.models.user import User, CustomerGroup, CustomerNote, CustomerActivityLog, Wishlist
from app.models.order import Order
from app.models.product import Product
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import (
    UserRegisterRequest, UserLoginRequest, GoogleLoginRequest, TokenResponse,
    UserProfileResponse, UserProfileUpdate, WishlistAddRequest, WishlistItemResponse,
    CustomerGroupCreate, CustomerGroupResponse, AddCustomerNoteRequest,
    CustomerNoteResponse, ActivityLogResponse, CustomerCRMDetailResponse
)

router = APIRouter()

# Helper: Log Activity
def log_activity(db: Session, customer_id: int, act_type: str, desc: str, ip: str = "127.0.0.1"):
    log = CustomerActivityLog(
        customer_id=customer_id,
        activity_type=act_type,
        description=desc,
        ip_address=ip
    )
    db.add(log)

# --- 1. AUTHENTICATION & SOCIAL LOGIN ---
@router.post("/auth/register", response_model=TokenResponse)
def register_customer(req: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        phone=req.phone,
        role="customer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_activity(db, user.id, "registration", "Customer account registered")
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user_id=user.id, full_name=user.full_name, role=user.role)


@router.post("/auth/login", response_model=TokenResponse)
def login_customer(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not user.hashed_password or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.is_blocked:
        raise HTTPException(status_code=403, detail="Account is blocked. Please contact customer support.")

    user.last_login_at = datetime.utcnow()
    log_activity(db, user.id, "login", "Successful email login")
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user_id=user.id, full_name=user.full_name, role=user.role)


@router.post("/auth/google-login", response_model=TokenResponse)
def google_social_login(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    
    if not user:
        user = User(
            email=req.email.lower(),
            full_name=req.full_name,
            google_id=req.google_id,
            auth_provider="google",
            role="customer"
        )
        db.add(user)
        db.flush()
        log_activity(db, user.id, "registration", "Registered via Google OAuth")
    else:
        if user.is_blocked:
            raise HTTPException(status_code=403, detail="Account is blocked.")
        user.google_id = req.google_id
        user.last_login_at = datetime.utcnow()
        log_activity(db, user.id, "login", "Logged in via Google OAuth")

    db.commit()
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user_id=user.id, full_name=user.full_name, role=user.role)


# --- 2. CUSTOMER SELF-SERVICE ---
@router.get("/customer/profile/{customer_id}", response_model=UserProfileResponse)
def get_customer_profile(customer_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")
    return user


@router.post("/customer/wishlist/{customer_id}")
def add_to_wishlist(customer_id: int, req: WishlistAddRequest, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Wishlist).filter(Wishlist.customer_id == customer_id, Wishlist.product_id == req.product_id).first()
    if existing:
        return {"message": "Product already in wishlist"}

    item = Wishlist(customer_id=customer_id, product_id=req.product_id)
    db.add(item)
    log_activity(db, customer_id, "wishlist_add", f"Added Product #{req.product_id} to wishlist")
    db.commit()
    return {"message": "Product added to wishlist successfully"}


# --- 3. ADMIN CRM & LIFETIME VALUE (CLV) ---
@router.get("/admin/crm/customers", response_model=List[UserProfileResponse])
def get_all_customers_crm(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "customer").all()


@router.get("/admin/crm/customers/{customer_id}", response_model=CustomerCRMDetailResponse)
def get_customer_crm_detail(customer_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Recalculate Customer Lifetime Value (CLV) from completed orders
    clv_query = db.query(
        func.count(Order.id).label("total_orders"),
        func.sum(Order.total_amount).label("lifetime_value")
    ).filter(Order.user_id == customer_id, Order.payment_status == "paid").first()

    user.total_orders_count = clv_query.total_orders or 0
    user.cached_lifetime_value = float(clv_query.lifetime_value or 0.0)

    # VIP auto-upgrade threshold check (e.g. Total spent > PKR 50,000)
    if user.cached_lifetime_value >= 50000 and not user.is_vip:
        user.is_vip = True

    db.commit()
    return user


@router.post("/admin/crm/customers/{customer_id}/block")
def toggle_customer_block_status(customer_id: int, block: bool, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    user.is_blocked = block
    log_activity(db, user.id, "status_change", f"Account {'blocked' if block else 'unblocked'} by admin")
    db.commit()
    return {"message": f"Customer status updated: blocked={block}"}


@router.post("/admin/crm/customers/{customer_id}/notes", response_model=CustomerNoteResponse)
def add_admin_note_to_customer(customer_id: int, req: AddCustomerNoteRequest, admin_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    note = CustomerNote(customer_id=customer_id, admin_id=admin_id, note=req.note)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note