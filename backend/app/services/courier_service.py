import uuid
from datetime import datetime, timedelta
from typing import Dict, Any

class BaseCourierAdapter:
    def create_waybill(self, order_id: int, recipient_data: dict, weight_kg: float) -> Dict[str, Any]:
        raise NotImplementedError

    def track_shipment(self, tracking_number: str) -> Dict[str, Any]:
        raise NotImplementedError

class TCSCourierAdapter(BaseCourierAdapter):
    def create_waybill(self, order_id: int, recipient_data: dict, weight_kg: float) -> Dict[str, Any]:
        # Placeholder for TCS API authentication & booking call
        tracking_no = f"TCS-{order_id}-{uuid.uuid4().hex[:6].upper()}"
        return {
            "courier_code": "tcs",
            "courier_name": "TCS Express Courier",
            "tracking_number": tracking_no,
            "estimated_days": 2
        }

class LeopardsCourierAdapter(BaseCourierAdapter):
    def create_waybill(self, order_id: int, recipient_data: dict, weight_kg: float) -> Dict[str, Any]:
        # Placeholder for Leopards API booking call
        tracking_no = f"LEO-{order_id}-{uuid.uuid4().hex[:6].upper()}"
        return {
            "courier_code": "leopards",
            "courier_name": "Leopards Courier Service",
            "tracking_number": tracking_no,
            "estimated_days": 3
        }

class MPCourierAdapter(BaseCourierAdapter):
    def create_waybill(self, order_id: int, recipient_data: dict, weight_kg: float) -> Dict[str, Any]:
        # Placeholder for M&P API booking call
        tracking_no = f"MNP-{order_id}-{uuid.uuid4().hex[:6].upper()}"
        return {
            "courier_code": "mnp",
            "courier_name": "M&P Express Logistics",
            "tracking_number": tracking_no,
            "estimated_days": 3
        }

class CourierFactory:
    @staticmethod
    def get_adapter(courier_code: str) -> BaseCourierAdapter:
        adapters = {
            "tcs": TCSCourierAdapter(),
            "leopards": LeopardsCourierAdapter(),
            "mnp": MPCourierAdapter(),
        }
        return adapters.get(courier_code.lower(), TCSCourierAdapter())