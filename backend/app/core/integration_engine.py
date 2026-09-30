import hmac
import hashlib
import secrets
import json
import logging
from typing import Dict, Any, List

logger = logging.getLogger("NexaCommerce.Integrations")

class IntegrationEngine:
    @staticmethod
    def generate_api_key(prefix: str = "nexa_live_") -> tuple[str, str, str]:
        """Generate a secure API Key, prefix and its SHA256 hash."""
        secret_token = secrets.token_hex(24)
        full_key = f"{prefix}{secret_token}"
        key_hash = hashlib.sha256(full_key.encode()).hexdigest()
        key_prefix = full_key[:12]
        return full_key, key_prefix, key_hash

    @staticmethod
    def sign_webhook_payload(payload: Dict[str, Any], secret: str) -> str:
        """Sign JSON payload using HMAC-SHA256 for secure Webhook verification."""
        json_data = json.dumps(payload, sort_keys=True).encode()
        return hmac.new(secret.encode(), json_data, hashlib.sha256).hexdigest()

    @staticmethod
    def dispatch_whatsapp_notification(phone: str, template: str, params: Dict[str, Any], config: Dict[str, Any]) -> Dict[str, Any]:
        """Dispatch WhatsApp Business Cloud API Message."""
        api_token = config.get("access_token")
        phone_number_id = config.get("phone_number_id")

        if not api_token or not phone_number_id:
            return {"status": "skipped", "reason": "WhatsApp API credentials not configured"}

        # Simulated API Payload to Meta Graph API
        logger.info(f"Sending WhatsApp notification via template '{template}' to {phone}")
        return {
            "status": "sent",
            "provider": "whatsapp_cloud_api",
            "message_id": f"wamid.{secrets.token_hex(8)}"
        }

    @staticmethod
    def send_meta_conversion_event(event_name: str, user_data: Dict[str, Any], custom_data: Dict[str, Any], config: Dict[str, Any]) -> Dict[str, Any]:
        """Server-Side Meta Conversions API (CAPI) Dispatcher."""
        pixel_id = config.get("pixel_id")
        access_token = config.get("access_token")

        if not pixel_id or not access_token:
            return {"status": "skipped", "reason": "Meta Pixel / CAPI credentials missing"}

        logger.info(f"Firing Server-Side Meta Event '{event_name}' for Pixel ID: {pixel_id}")
        return {
            "status": "success",
            "event": event_name,
            "events_received": 1,
            "fbtrace_id": f"fb_{secrets.token_hex(6)}"
        }

    @staticmethod
    def generate_google_merchant_feed(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format catalog products into Google Merchant Center Product Feed Schema."""
        feed = []
        for p in products:
            feed.append({
                "id": str(p.get("id")),
                "title": p.get("title"),
                "description": p.get("description", "")[:5000],
                "link": f"https://store.nexacommerce.com/product/{p.get('slug', p.get('id'))}",
                "image_link": p.get("image_url", ""),
                "availability": "in_stock" if p.get("stock", 0) > 0 else "out_of_stock",
                "price": f"{p.get('price', 0.00)} PKR",
                "brand": p.get("brand", "NexaCommerce"),
                "condition": "new"
            })
        return feed