from abc import ABC, abstractmethod
from typing import Dict, Any

class BasePaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, order_id: int, amount: float, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes payment and returns dictionary with status, transaction_id, and redirect_url (if needed)
        """
        pass


class CODPaymentGateway(BasePaymentGateway):
    def process_payment(self, order_id: int, amount: float, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": True,
            "status": "pending",
            "transaction_id": f"COD-{order_id}",
            "message": "Cash on Delivery order placed successfully."
        }


class BankTransferGateway(BasePaymentGateway):
    def process_payment(self, order_id: int, amount: float, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": True,
            "status": "pending",
            "transaction_id": f"BANK-{order_id}",
            "message": "Bank transfer initiated. Please transfer funds to the designated account."
        }


class StripePaymentGateway(BasePaymentGateway):
    def process_payment(self, order_id: int, amount: float, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        # Placeholder for Stripe SDK (e.g. stripe.PaymentIntent.create)
        stripe_token = payment_data.get("stripe_token")
        if not stripe_token and not payment_data.get("dummy_success", True):
            return {"success": False, "status": "failed", "message": "Stripe token missing or declined"}
        
        return {
            "success": True,
            "status": "success",
            "transaction_id": f"ch_stripe_mock_{order_id}",
            "message": "Stripe payment successful."
        }


class WalletPaymentGateway(BasePaymentGateway):
    def process_payment(self, order_id: int, amount: float, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": True,
            "status": "success",
            "transaction_id": f"WLT-{order_id}",
            "message": "Payment deducted from store wallet."
        }


# Factory Pattern for Payment Gateways
class PaymentGatewayFactory:
    _gateways = {
        "cod": CODPaymentGateway(),
        "bank_transfer": BankTransferGateway(),
        "stripe": StripePaymentGateway(),
        "wallet": WalletPaymentGateway()
    }

    @classmethod
    def get_gateway(cls, gateway_name: str) -> BasePaymentGateway:
        gateway_key = gateway_name.lower()
        if gateway_key not in cls._gateways:
            raise ValueError(f"Unsupported payment method: {gateway_name}")
        return cls._gateways[gateway_key]