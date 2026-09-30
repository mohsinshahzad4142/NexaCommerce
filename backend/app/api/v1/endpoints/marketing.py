from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.models.marketing import FlashSale, FlashSaleItem, GiftCard, LoyaltyAccount, MarketingCampaign
from app.schemas.marketing import (
    FlashSaleCreate, FlashSaleResponse, GiftCardCreate, GiftCardResponse,
    GiftCardRedeemRequest, LoyaltyAccountResponse, RedeemPointsRequest,
    SendNotificationCampaignRequest, AbandonedCartRecoveryTrigger
)
from app.services.marketing_service import MarketingEngine, NotificationAdapter

router = APIRouter()

# --- 1. FLASH SALES MANAGEMENT ---
@router.post("/admin/flash-sales", response_model=FlashSaleResponse)
def create_flash_sale(req: FlashSaleCreate, db: Session = Depends(get_db)):
    sale = FlashSale(
        title=req.title,
        banner_url=req.banner_url,
        start_time=req.start_time,
        end_time=req.end_time
    )
    db.add(sale)
    db.flush()

    for item in req.items:
        db_item = FlashSaleItem(
            flash_sale_id=sale.id,
            product_id=item.product_id,
            sale_price=item.sale_price,
            quantity_limit=item.quantity_limit
        )
        db.add(db_item)

    db.commit()
    db.refresh(sale)
    return sale


@router.get("/flash-sales/active", response_model=List[FlashSaleResponse])
def get_active_flash_sales(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    return db.query(FlashSale).filter(
        FlashSale.is_active == True,
        FlashSale.start_time <= now,
        FlashSale.end_time >= now
    ).all()


# --- 2. GIFT CARDS SYSTEM ---
@router.post("/admin/gift-cards/issue", response_model=GiftCardResponse)
def issue_new_gift_card(req: GiftCardCreate, db: Session = Depends(get_db)):
    return MarketingEngine.issue_gift_card(db, req.initial_balance)


@router.post("/gift-cards/redeem")
def redeem_gift_card(req: GiftCardRedeemRequest, db: Session = Depends(get_db)):
    card = db.query(GiftCard).filter(GiftCard.code == req.code, GiftCard.is_active == True).first()
    if not card:
        raise HTTPException(status_code=404, detail="Invalid or inactive gift card")

    if card.current_balance < req.amount_to_use:
        raise HTTPException(status_code=400, detail=f"Insufficient balance. Available: {card.current_balance}")

    card.current_balance -= req.amount_to_use
    if card.current_balance == 0:
        card.is_active = False

    db.commit()
    return {"message": "Gift card balance applied", "remaining_balance": card.current_balance}


# --- 3. LOYALTY POINTS & REWARDS ---
@router.get("/loyalty/account/{user_id}", response_model=LoyaltyAccountResponse)
def get_loyalty_account(user_id: int, db: Session = Depends(get_db)):
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == user_id).first()
    if not account:
        account = LoyaltyAccount(user_id=user_id, points_balance=0, tier_level="Bronze")
        db.add(account)
        db.commit()
        db.refresh(account)
    return account


@router.post("/loyalty/redeem")
def redeem_points(req: RedeemPointsRequest, db: Session = Depends(get_db)):
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == req.user_id).first()
    if not account or account.points_balance < req.points_to_redeem:
        raise HTTPException(status_code=400, detail="Insufficient loyalty points balance")

    # Example conversion: 100 Points = PKR 10 Discount
    discount_value = (req.points_to_redeem / 100.0) * 10.0
    account.points_balance -= req.points_to_redeem
    db.commit()

    return {"message": "Points redeemed", "discount_amount_pkr": discount_value, "remaining_points": account.points_balance}


# --- 4. OMNICHANNEL MARKETING CAMPAIGNS ---
@router.post("/admin/marketing/campaigns/send")
def execute_campaign(req: SendNotificationCampaignRequest, db: Session = Depends(get_db)):
    campaign = MarketingCampaign(
        title=req.title,
        channel=req.channel,
        target_segment=req.target_segment,
        subject_or_header=req.subject_or_header,
        message_body=req.message_body,
        status="sent",
        sent_at=datetime.utcnow()
    )
    db.add(campaign)
    db.commit()

    return {"message": f"Campaign '{req.title}' dispatched successfully via {req.channel}"}


# --- 5. ABANDONED CART RECOVERY ---
@router.post("/marketing/abandoned-cart/recover")
def recover_abandoned_cart(req: AbandonedCartRecoveryTrigger, db: Session = Depends(get_db)):
    res = MarketingEngine.trigger_abandoned_cart_recovery(db, req.user_id, req.channel)
    if not res["success"]:
        raise HTTPException(status_code=400, detail=res["message"])
    return res