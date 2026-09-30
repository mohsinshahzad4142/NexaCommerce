from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List

# 1. Store Identity & General Settings
class GeneralStoreSettings(BaseModel):
    store_name: str = "NexaCommerce"
    logo_url: Optional[str] = "/assets/logo.png"
    favicon_url: Optional[str] = "/assets/favicon.ico"
    contact_email: EmailStr = "support@nexacommerce.com"
    contact_phone: Optional[str] = "+92 300 1234567"
    store_address: Optional[str] = "Lahore, Pakistan"

# 2. Localization & Currency
class LocalizationCurrencySettings(BaseModel):
    currency_code: str = "PKR"
    currency_symbol: str = "Rs."
    currency_position: str = "left" # 'left' or 'right'
    timezone: str = "Asia/Karachi"
    weight_unit: str = "kg"

# 3. Tax & Shipping Rules
class TaxAndShippingSettings(BaseModel):
    enable_tax: bool = True
    default_tax_rate_pct: float = 17.0
    prices_include_tax: bool = False
    enable_flat_shipping: bool = True
    default_shipping_fee: float = 250.0
    free_shipping_threshold: float = 5000.0

# 4. Payment Gateways Toggles & Credentials
class PaymentGatewaySettings(BaseModel):
    enable_cod: bool = True
    enable_stripe: bool = False
    stripe_public_key: Optional[str] = ""
    stripe_secret_key: Optional[str] = ""
    enable_easypaisa: bool = True
    easypaisa_merchant_id: Optional[str] = ""
    enable_jazzcash: bool = True
    jazzcash_merchant_id: Optional[str] = ""

# 5. Email & SMS Notifications Configuration
class NotificationSettings(BaseModel):
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: Optional[str] = ""
    smtp_password: Optional[str] = ""
    sender_name: str = "NexaCommerce Store"
    sender_email: EmailStr = "noreply@nexacommerce.com"
    enable_email_notifications: bool = True
    sms_provider: str = "twilio" # 'twilio', 'local_gateway'
    sms_api_key: Optional[str] = ""
    enable_sms_notifications: bool = False

# 6. Invoice Customization
class InvoiceSettings(BaseModel):
    invoice_prefix: str = "NEXA-INV-"
    next_invoice_number: int = 1001
    company_tax_id: Optional[str] = "STRN-9988776"
    invoice_footer_text: Optional[str] = "Thank you for shopping with NexaCommerce!"

# 7. Order & Checkout Rules
class OrderCheckoutSettings(BaseModel):
    allow_guest_checkout: bool = True
    require_phone_number: bool = True
    min_order_amount: float = 500.0
    stock_reservation_minutes: int = 30
    auto_cancel_unpaid_hours: int = 24

# 8. Social Links & SEO Master Settings
class SocialAndSEOSettings(BaseModel):
    meta_title: str = "NexaCommerce - Premium Online Shopping"
    meta_description: str = "Shop high quality products with fast shipping."
    meta_keywords: str = "ecommerce, online shopping, electronics, fashion"
    og_image_url: Optional[str] = "/assets/og-share.jpg"
    facebook_url: Optional[str] = "https://facebook.com"
    instagram_url: Optional[str] = "https://instagram.com"
    twitter_url: Optional[str] = "https://twitter.com"
    tiktok_url: Optional[str] = "https://tiktok.com"

# Unified Bulk Update Schema
class BulkSettingsUpdateSchema(BaseModel):
    general: Optional[GeneralStoreSettings] = None
    localization: Optional[LocalizationCurrencySettings] = None
    tax_shipping: Optional[TaxAndShippingSettings] = None
    payment: Optional[PaymentGatewaySettings] = None
    notifications: Optional[NotificationSettings] = None
    invoice: Optional[InvoiceSettings] = None
    checkout: Optional[OrderCheckoutSettings] = None
    social_seo: Optional[SocialAndSEOSettings] = None

class AllStoreSettingsResponse(BaseModel):
    general: GeneralStoreSettings
    localization: LocalizationCurrencySettings
    tax_shipping: TaxAndShippingSettings
    payment: PaymentGatewaySettings
    notifications: NotificationSettings
    invoice: InvoiceSettings
    checkout: OrderCheckoutSettings
    social_seo: SocialAndSEOSettings