from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, Any, List, Optional
import json

from app.models.notifications import NotificationTemplate, NotificationLog
from app.models.settings import StoreSetting

# 10 MANDATORY SUPPORTED EVENTS
SUPPORTED_EVENTS = [
    "new_order", "order_confirmed", "order_shipped", "order_delivered",
    "order_cancelled", "payment_received", "payment_failed",
    "low_stock", "new_customer", "password_reset"
]

# DEFAULT TEMPLATES SEED MATRIX
DEFAULT_TEMPLATES = [
    {
        "event_type": "new_order", "channel": "email",
        "subject_template": "Order Placed successfully #{order_number}",
        "body_template": "Hi {customer_name},\nThank you for your order #{order_number} worth {amount}. We are processing it now!"
    },
    {
        "event_type": "new_order", "channel": "sms",
        "subject_template": None,
        "body_template": "NexaCommerce: Order #{order_number} received! Total: {amount}. Thank you for shopping with us."
    },
    {
        "event_type": "order_shipped", "channel": "whatsapp",
        "subject_template": None,
        "body_template": "Hello {customer_name}! Your order #{order_number} has been shipped via {courier_name}. Tracking ID: {tracking_id}"
    },
    {
        "event_type": "password_reset", "channel": "email",
        "subject_template": "Reset Your NexaCommerce Password",
        "body_template": "Hi {customer_name},\nClick here to reset your password: {reset_link}\nIf you didn't request this, please ignore."
    },
    {
        "event_type": "low_stock", "channel": "push",
        "subject_template": "Low Stock Warning",
        "body_template": "Product '{product_name}' (SKU: {sku}) is running low ({stock_left} left)."
    }
]

class NotificationAdapters:
    @staticmethod
    def send_email(recipient: str, subject: str, body: str) -> bool:
        # Mock / Adapter for Email Provider (e.g. SMTP / SendGrid)
        print(f"[EMAIL ENGINE] Sent to: {recipient} | Subject: {subject}")
        return True

    @staticmethod
    def send_sms(recipient: str, body: str) -> bool:
        # Mock / Adapter for SMS Provider (e.g. Twilio / Local SMS Gateway)
        print(f"[SMS ENGINE] Sent to: {recipient} | Body: {body}")
        return True

    @staticmethod
    def send_whatsapp(recipient: str, body: str) -> bool:
        # Mock / Adapter for Meta WhatsApp Business API
        print(f"[WHATSAPP ENGINE] Sent to: {recipient} | Message: {body}")
        return True

    @staticmethod
    def send_push(device_token: str, title: str, body: str) -> bool:
        # Mock / Adapter for Firebase Cloud Messaging (FCM)
        print(f"[PUSH ENGINE] Sent to Token: {device_token} | Title: {title} | Body: {body}")
        return True


class NotificationService:

    @staticmethod
    def seed_default_templates(db: Session):
        for tmpl in DEFAULT_TEMPLATES:
            existing = db.query(NotificationTemplate).filter(
                NotificationTemplate.event_type == tmpl["event_type"],
                NotificationTemplate.channel == tmpl["channel"]
            ).first()
            if not existing:
                db.add(NotificationTemplate(
                    event_type=tmpl["event_type"],
                    channel=tmpl["channel"],
                    subject_template=tmpl["subject_template"],
                    body_template=tmpl["body_template"],
                    is_active=True
                ))
        db.commit()

    @staticmethod
    def render_template(template_str: str, variables: Dict[str, Any]) -> str:
        rendered = template_str
        for k, v in variables.items():
            rendered = rendered.replace(f"{{{k}}}", str(v))
        return rendered

    @staticmethod
    def dispatch_event(
        db: Session,
        event_type: str,
        variables: Dict[str, Any],
        recipient_email: Optional[str] = None,
        recipient_phone: Optional[str] = None,
        fcm_device_token: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:

        if event_type not in SUPPORTED_EVENTS:
            raise ValueError(f"Unsupported event type '{event_type}'")

        # Fetch active templates for this event
        templates = db.query(NotificationTemplate).filter(
            NotificationTemplate.event_type == event_type,
            NotificationTemplate.is_active == True
        ).all()

        results = []

        for tmpl in templates:
            body = NotificationService.render_template(tmpl.body_template, variables)
            subject = NotificationService.render_template(tmpl.subject_template, variables) if tmpl.subject_template else None

            sent_success = False
            error_msg = None
            recipient_used = None

            try:
                if tmpl.channel == "email" and recipient_email:
                    recipient_used = recipient_email
                    sent_success = NotificationAdapters.send_email(recipient_email, subject or "Store Update", body)

                elif tmpl.channel == "sms" and recipient_phone:
                    recipient_used = recipient_phone
                    sent_success = NotificationAdapters.send_sms(recipient_phone, body)

                elif tmpl.channel == "whatsapp" and recipient_phone:
                    recipient_used = recipient_phone
                    sent_success = NotificationAdapters.send_whatsapp(recipient_phone, body)

                elif tmpl.channel == "push" and fcm_device_token:
                    recipient_used = fcm_device_token
                    sent_success = NotificationAdapters.send_push(fcm_device_token, subject or "Alert", body)

                if recipient_used:
                    log = NotificationLog(
                        user_id=user_id,
                        event_type=event_type,
                        channel=tmpl.channel,
                        recipient=recipient_used,
                        subject=subject,
                        body=body,
                        status="sent" if sent_success else "failed",
                        error_message=error_msg
                    )
                    db.add(log)
                    results.append({"channel": tmpl.channel, "status": "sent" if sent_success else "failed"})

            except Exception as e:
                error_msg = str(e)
                if recipient_used:
                    log = NotificationLog(
                        user_id=user_id, event_type=event_type, channel=tmpl.channel,
                        recipient=recipient_used, subject=subject, body=body,
                        status="failed", error_message=error_msg
                    )
                    db.add(log)
                results.append({"channel": tmpl.channel, "status": "failed", "error": error_msg})

        db.commit()
        return results