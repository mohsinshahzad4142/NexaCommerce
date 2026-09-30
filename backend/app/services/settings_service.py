from sqlalchemy.orm import Session
from typing import Dict, Any

from app.models.settings import StoreSetting
from app.schemas.settings import (
    GeneralStoreSettings, LocalizationCurrencySettings, TaxAndShippingSettings,
    PaymentGatewaySettings, NotificationSettings, InvoiceSettings,
    OrderCheckoutSettings, SocialAndSEOSettings
)

DEFAULT_CONFIGS = {
    "general": GeneralStoreSettings().model_dump(),
    "localization": LocalizationCurrencySettings().model_dump(),
    "tax_shipping": TaxAndShippingSettings().model_dump(),
    "payment": PaymentGatewaySettings().model_dump(),
    "notifications": NotificationSettings().model_dump(),
    "invoice": InvoiceSettings().model_dump(),
    "checkout": OrderCheckoutSettings().model_dump(),
    "social_seo": SocialAndSEOSettings().model_dump(),
}

class SettingsService:

    @staticmethod
    def get_all_settings(db: Session) -> Dict[str, Any]:
        db_records = db.query(StoreSetting).all()
        saved_settings = {rec.key: rec.value for rec in db_records}

        merged = {}
        for category, defaults in DEFAULT_CONFIGS.items():
            if category in saved_settings:
                # Merge defaults with saved keys
                merged[category] = {**defaults, **saved_settings[category]}
            else:
                merged[category] = defaults

        return merged

    @staticmethod
    def update_category_setting(db: Session, category: str, data: Dict[str, Any]):
        rec = db.query(StoreSetting).filter(StoreSetting.key == category).first()
        if not rec:
            rec = StoreSetting(category=category, key=category, value=data)
            db.add(rec)
        else:
            rec.value = data
        db.commit()

    @staticmethod
    def bulk_update_settings(db: Session, update_payload: Dict[str, Any]):
        for category, data in update_payload.items():
            if data is not None:
                SettingsService.update_category_setting(db, category, data)
        return SettingsService.get_all_settings(db)

    @staticmethod
    def get_public_store_config(db: Session) -> Dict[str, Any]:
        all_settings = SettingsService.get_all_settings(db)
        # Filter out sensitive credentials for public API
        payment = all_settings["payment"].copy()
        payment.pop("stripe_secret_key", None)
        payment.pop("easypaisa_merchant_id", None)
        payment.pop("jazzcash_merchant_id", None)

        notifications = all_settings["notifications"].copy()
        notifications.pop("smtp_password", None)
        notifications.pop("sms_api_key", None)

        return {
            "general": all_settings["general"],
            "localization": all_settings["localization"],
            "tax_shipping": all_settings["tax_shipping"],
            "payment_methods": {
                "enable_cod": payment["enable_cod"],
                "enable_stripe": payment["enable_stripe"],
                "stripe_public_key": payment.get("stripe_public_key", ""),
                "enable_easypaisa": payment["enable_easypaisa"],
                "enable_jazzcash": payment["enable_jazzcash"],
            },
            "checkout": all_settings["checkout"],
            "social_seo": all_settings["social_seo"]
        }