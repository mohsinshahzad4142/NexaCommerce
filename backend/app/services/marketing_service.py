import uuid
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.marketing import (
    GiftCard, LoyaltyAccount, LoyaltyTransaction,
    MarketingCampaign, FlashSale, FlashSaleItem
)
from app.models.user import User
from app.models.cart import Cart

class NotificationAdapter:
    @staticmethod
    def send_whatsapp(phone: str, message: str) -> bool:
        # Placeholder for Meta WhatsApp Cloud API integration
        print(f"[WHATSAPP SENT] To: {phone} | Msg: {message}")
        return True

    @staticmethod
    def send_sms(phone: str, message: str) -> bool:
        # Placeholder for SMS Gateway (Twilio / Local Telco)
        print(f"[SMS SENT] To: {phone} | Msg: {message}")
        return True

    @staticmethod
    def send_email(email: str, subject: str, body: str) -> bool:
        # Placeholder for SendGrid / SMTP
        print(f"[EMAIL SENT] To: {email} | Subject: {subject}")
        return True

    @staticmethod
    def send_push(user_id: int, title: str, body: str) -> bool:
        # Placeholder for Firebase FCM
        print(f"[PUSH SENT] User: {user_id} | Title: {title}")
        return True


class MarketingEngine:
    @staticmethod
    def issue_gift_card(db: Session, balance: float, creator_id: Optional[int] = None) -> GiftCard:
        code = f"GC-{uuid.uuid4().hex[:8].upper()}"
        card = GiftCard(
            code=code,
            initial_balance=balance,
            current_balance=balance,
            created_by_user_id=creator_id
        )
        db.add(card)
        db.commit()
        db.refresh(card)
        return card

    @staticmethod
    def add_loyalty_points(db: Session, user_id: int, points: int, reason: str) -> LoyaltyAccount:
        account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == user_id).first()
        if not account:
            account = LoyaltyAccount(user_id=user_id, points_balance=0)
            db.add(account)
            db.flush()

        account.points_balance += points
        
        # Tier upgrade check
        if account.points_balance > 10000:
            account.tier_level = "Platinum"
        elif account.points_balance > 5000:
            account.tier_level = "Gold"
        elif account.points_balance > 1000:
            account.tier_level = "Silver"

        txn = LoyaltyTransaction(
            account_id=account.id,
            points=points,
            type="earn",
            description=reason
        )
        db.add(txn)
        db.commit()
        db.refresh(account)
        return account

    @staticmethod
    def trigger_abandoned_cart_recovery(db: Session, user_id: int, channel: str) -> Dict[str, Any]:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"success": False, "message": "User not found"}

        cart = db.query(Cart).filter(Cart.user_id == user_id).first()
        if not cart or not cart.items:
            return {"success": False, "message": "No active cart or empty items"}

        msg = f"Hi {user.full_name}, you left items in your cart! Complete your purchase now and get 5% off with code SAVE5."

        if channel == "whatsapp" and user.phone:
            NotificationAdapter.send_whatsapp(user.phone, msg)
        elif channel == "sms" and user.phone:
            NotificationAdapter.send_sms(user.phone, msg)
        else:
            NotificationAdapter.send_email(user.email, "Complete your order - NexaCommerce", msg)

        return {"success": True, "message": f"Abandoned cart recovery message dispatched via {channel}"}