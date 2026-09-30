import logging

logger = logging.getLogger("NexaCommerceNotifications")

def send_order_confirmation_email(email: str, order_number: str, grand_total: float):
    # Integration point for SendGrid / AWS SES / SMTP
    logger.info(f"[EMAIL NOTIFICATION] Sent confirmation email for order #{order_number} to {email} (Total: PKR {grand_total})")

def send_order_sms_whatsapp(phone: str, order_number: str, status: str):
    # Integration point for Twilio / WhatsApp Business API
    logger.info(f"[SMS/WHATSAPP NOTIFICATION] Sent alert to {phone} - Order #{order_number} is now {status}.")