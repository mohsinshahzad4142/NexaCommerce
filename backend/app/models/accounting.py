from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"

    id = Column(Integer, primary_key=True, index=True)
    entry_type = Column(String(30), nullable=False, index=True) # 'revenue', 'expense', 'tax', 'refund', 'fee'
    account_code = Column(String(50), default="4000") # Chart of Accounts Code (e.g. 4000=Sales, 5000=Expense)
    amount = Column(Float, nullable=False)
    reference_type = Column(String(50), nullable=True) # 'order', 'expense', 'refund', 'payout'
    reference_id = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(100), unique=True, nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    subtotal = Column(Float, nullable=False)
    tax_total = Column(Float, default=0.0)
    discount_total = Column(Float, default=0.0)
    grand_total = Column(Float, nullable=False)
    status = Column(String(30), default="issued", index=True) # 'draft', 'issued', 'paid', 'void', 'partially_refunded'
    issued_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)

    credit_notes = relationship("CreditNote", back_populates="invoice", cascade="all, delete-orphan")


class CreditNote(Base):
    __tablename__ = "credit_notes"

    id = Column(Integer, primary_key=True, index=True)
    credit_note_number = Column(String(100), unique=True, nullable=False, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    tax_refunded = Column(Float, default=0.0)
    reason = Column(Text, nullable=True)
    issued_at = Column(DateTime, default=datetime.utcnow)

    invoice = relationship("Invoice", back_populates="credit_notes")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False, index=True) # 'shipping', 'marketing', 'server_cost', 'vendor_payout', 'office'
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    vendor_name = Column(String(150), nullable=True)
    receipt_url = Column(String(500), nullable=True)
    expense_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class PaymentReconciliation(Base):
    __tablename__ = "payment_reconciliations"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    gateway_name = Column(String(50), nullable=False) # 'stripe', 'paypal', 'easypaisa', 'jazzcash', 'cod'
    gateway_transaction_id = Column(String(150), nullable=True, index=True)
    expected_amount = Column(Float, nullable=False)
    received_amount = Column(Float, nullable=False)
    gateway_fee = Column(Float, default=0.0)
    discrepancy = Column(Float, default=0.0)
    status = Column(String(30), default="reconciled", index=True) # 'reconciled', 'discrepancy_flagged', 'pending'
    reconciled_at = Column(DateTime, default=datetime.utcnow)