from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import hashlib

from app.db.database import get_db
from app.schemas.integration import (
    APIKeyCreateSchema, APIKeyResponseSchema,
    WebhookSubscribeSchema, ThirdPartyConfigSchema,
    WhatsAppMessageSchema, MetaPixelEventSchema
)
from app.models.integration import APIKey, WebhookSubscription, WebhookLog, ThirdPartyIntegration
from app.models.product import Product
from app.core.integration_engine import IntegrationEngine

router = APIRouter()

# --- 1. API KEYS MANAGEMENT ---
@router.post("/integrations/api-keys", response_model=APIKeyResponseSchema)
def create_api_key(req: APIKeyCreateSchema, db: Session = Depends(get_db)):
    raw_key, prefix, key_hash = IntegrationEngine.generate_api_key()

    api_key = APIKey(
        name=req.name,
        key_hash=key_hash,
        prefix=prefix,
        user_id=req.user_id,
        scopes=req.scopes or ["read_only"],
        is_active=True
    )
    db.add(api_key)
    db.commit()

    res = APIKeyResponseSchema.from_orm(api_key)
    res.raw_api_key = raw_key # Return clear key only once
    return res


@router.get("/integrations/api-keys", response_model=List[APIKeyResponseSchema])
def list_api_keys(user_id: int, db: Session = Depends(get_db)):
    return db.query(APIKey).filter(APIKey.user_id == user_id).all()


@router.delete("/integrations/api-keys/{key_id}")
def revoke_api_key(key_id: int, db: Session = Depends(get_db)):
    key_rec = db.query(APIKey).filter(APIKey.id == key_id).first()
    if not key_rec:
        raise HTTPException(status_code=404, detail="API Key not found")
    key_rec.is_active = False
    db.commit()
    return {"message": "API Key revoked successfully."}


# --- 2. WEBHOOK SUBSCRIPTIONS ---
@router.post("/integrations/webhooks/subscribe")
def subscribe_webhook(req: WebhookSubscribeSchema, db: Session = Depends(get_db)):
    secret = IntegrationEngine.generate_api_key(prefix="whsec_")[0]
    webhook = WebhookSubscription(
        name=req.name,
        target_url=req.target_url,
        secret=secret,
        events=req.events,
        is_active=True
    )
    db.add(webhook)
    db.commit()
    return {"id": webhook.id, "target_url": webhook.target_url, "signing_secret": secret}


@router.get("/integrations/webhooks")
def list_webhooks(db: Session = Depends(get_db)):
    return db.query(WebhookSubscription).all()


# --- 3. THIRD-PARTY INTEGRATION SETTINGS (ERP, CRM, WhatsApp, Meta) ---
@router.post("/integrations/third-party/config")
def save_third_party_config(req: ThirdPartyConfigSchema, db: Session = Depends(get_db)):
    integration = db.query(ThirdPartyIntegration).filter(ThirdPartyIntegration.provider == req.provider).first()
    if not integration:
        integration = ThirdPartyIntegration(provider=req.provider, is_enabled=req.is_enabled, config=req.config)
        db.add(integration)
    else:
        integration.is_enabled = req.is_enabled
        integration.config = req.config
    db.commit()
    return {"message": f"Configuration for provider '{req.provider}' updated successfully."}


# --- 4. WHATSAPP BUSINESS API TRIGGER ---
@router.post("/integrations/whatsapp/send")
def send_whatsapp_template(req: WhatsAppMessageSchema, db: Session = Depends(get_db)):
    config_rec = db.query(ThirdPartyIntegration).filter(ThirdPartyIntegration.provider == "whatsapp").first()
    cfg = config_rec.config if (config_rec and config_rec.is_enabled) else {}

    res = IntegrationEngine.dispatch_whatsapp_notification(req.recipient_phone, req.template_name, req.parameters, cfg)
    return res


# --- 5. META PIXEL & CONVERSIONS API (CAPI) DISPATCH ---
@router.post("/integrations/meta-pixel/event")
def track_meta_event(req: MetaPixelEventSchema, db: Session = Depends(get_db)):
    config_rec = db.query(ThirdPartyIntegration).filter(ThirdPartyIntegration.provider == "meta_pixel").first()
    cfg = config_rec.config if (config_rec and config_rec.is_enabled) else {}

    return IntegrationEngine.send_meta_conversion_event(req.event_name, req.user_data, req.custom_data, cfg)


# --- 6. GOOGLE MERCHANT CENTER PRODUCT FEED API ---
@router.get("/integrations/google-merchant/feed")
def get_google_merchant_feed(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).all()
    prod_list = [{"id": p.id, "title": p.title, "description": p.description, "price": p.price, "stock": p.stock, "brand": "NexaCommerce"} for p in products]

    feed = IntegrationEngine.generate_google_merchant_feed(prod_list)
    return {"item_count": len(feed), "products": feed}