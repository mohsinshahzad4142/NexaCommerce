import logging
from typing import Dict, Any, List

logger = logging.getLogger("NexaCommerce.MultiTenant")

class MultiTenantVendorEngine:
    @staticmethod
    def calculate_commission(item_price: float, quantity: int, commission_rate: float) -> Dict[str, float]:
        """Calculates platform commission and vendor payout amount."""
        total_amount = item_price * quantity
        platform_commission = round((total_amount * commission_rate) / 100.0, 2)
        vendor_payout = round(total_amount - platform_commission, 2)

        return {
            "total_amount": total_amount,
            "platform_commission": platform_commission,
            "vendor_payout": vendor_payout
        }

    @staticmethod
    def convert_currency(amount: float, from_curr: str, to_curr: str, rates: Dict[str, float]) -> float:
        """Convert amount between currencies using current exchange rates."""
        if from_curr == to_curr:
            return amount

        # Convert to Base (USD)
        base_amount = amount / rates.get(from_curr, 1.0)
        # Convert from Base to Target
        converted = base_amount * rates.get(to_curr, 1.0)
        return round(converted, 2)

    @staticmethod
    def calculate_country_tax(amount: float, country_code: str, tax_rules: Dict[str, float]) -> float:
        """Calculate multi-country tax based on ISO country code."""
        tax_rate = tax_rules.get(country_code.upper(), 0.0)
        tax_amount = round((amount * tax_rate) / 100.0, 2)
        return tax_amount