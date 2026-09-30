import logging
import secrets
from typing import Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.accounting import LedgerEntry, Invoice, CreditNote, Expense, PaymentReconciliation

logger = logging.getLogger("NexaCommerce.AccountingEngine")

class AccountingEngine:

    @staticmethod
    def generate_invoice_number() -> str:
        """Generates unique formatted invoice number (e.g. INV-2026-89A1)."""
        year = datetime.utcnow().strftime("%Y")
        code = secrets.token_hex(2).upper()
        return f"INV-{year}-{code}"

    @staticmethod
    def generate_credit_note_number() -> str:
        """Generates unique formatted credit note number (e.g. CN-2026-44F2)."""
        year = datetime.utcnow().strftime("%Y")
        code = secrets.token_hex(2).upper()
        return f"CN-{year}-{code}"

    @staticmethod
    def record_ledger_transaction(
        db: Session,
        entry_type: str,
        amount: float,
        account_code: str = "4000",
        reference_type: str = None,
        reference_id: int = None,
        description: str = ""
    ) -> LedgerEntry:
        """Records a entry in the central double-entry double-compatible ledger."""
        entry = LedgerEntry(
            entry_type=entry_type,
            account_code=account_code,
            amount=amount,
            reference_type=reference_type,
            reference_id=reference_id,
            description=description
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        logger.info(f"Ledger [{entry_type.upper()}] logged: {amount} (Ref: {reference_type} #{reference_id})")
        return entry

    @staticmethod
    def calculate_profit_and_loss(db: Session) -> Dict[str, Any]:
        """Calculates total gross revenue, expenses, refunds, tax collected and net profit."""
        # Total Revenue from Ledger
        gross_revenue = db.query(func.sum(LedgerEntry.amount)).filter(LedgerEntry.entry_type == "revenue").scalar() or 0.0
        
        # Total Refunds from Ledger
        total_refunds = db.query(func.sum(LedgerEntry.amount)).filter(LedgerEntry.entry_type == "refund").scalar() or 0.0
        
        # Net Sales Revenue
        net_revenue = gross_revenue - total_refunds

        # Total Expenses
        total_expenses = db.query(func.sum(Expense.amount)).scalar() or 0.0

        # Gateway Fees
        gateway_fees = db.query(func.sum(PaymentReconciliation.gateway_fee)).scalar() or 0.0

        # Total Tax Liabilities
        total_tax_collected = db.query(func.sum(LedgerEntry.amount)).filter(LedgerEntry.entry_type == "tax").scalar() or 0.0

        # Net Profit Calculation
        net_profit = net_revenue - total_expenses - gateway_fees

        return {
            "gross_revenue": round(gross_revenue, 2),
            "refunds_and_returns": round(total_refunds, 2),
            "net_revenue": round(net_revenue, 2),
            "operating_expenses": round(total_expenses, 2),
            "payment_gateway_fees": round(gateway_fees, 2),
            "total_tax_collected": round(total_tax_collected, 2),
            "net_profit": round(net_profit, 2),
            "profit_margin_percent": round((net_profit / net_revenue * 100), 2) if net_revenue > 0 else 0.0
        }

    @staticmethod
    def sync_to_external_accounting(target_platform: str, entity_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Mock dispatcher for QuickBooks Online, Xero, and Tally ERP sync."""
        logger.info(f"Syncing {entity_type} to {target_platform.upper()} Cloud API...")
        return {
            "status": "synced",
            "platform": target_platform,
            "entity_type": entity_type,
            "remote_id": f"{target_platform[:2].upper()}-{secrets.token_hex(4)}",
            "synced_at": datetime.utcnow().isoformat()
        }