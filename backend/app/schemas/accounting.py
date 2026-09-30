from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ExpenseCreateSchema(BaseModel):
    category: str
    description: str
    amount: float
    tax_amount: Optional[float] = 0.0
    vendor_name: Optional[str] = None
    receipt_url: Optional[str] = None

class InvoiceCreateSchema(BaseModel):
    order_id: int
    customer_id: Optional[int] = None
    subtotal: float
    tax_total: float = 0.0
    discount_total: float = 0.0
    grand_total: float

class CreditNoteCreateSchema(BaseModel):
    invoice_id: int
    amount: float
    tax_refunded: Optional[float] = 0.0
    reason: str

class PaymentReconciliationSchema(BaseModel):
    order_id: int
    gateway_name: str
    gateway_transaction_id: str
    expected_amount: float
    received_amount: float
    gateway_fee: Optional[float] = 0.0

class AccountingSyncTriggerSchema(BaseModel):
    target_platform: str # 'quickbooks', 'xero', 'tally'
    entity_type: str # 'invoice', 'expense', 'credit_note'
    entity_id: int