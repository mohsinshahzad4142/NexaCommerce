from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.database import get_db
from app.schemas.accounting import (
    ExpenseCreateSchema, InvoiceCreateSchema,
    CreditNoteCreateSchema, PaymentReconciliationSchema,
    AccountingSyncTriggerSchema
)
from app.models.accounting import LedgerEntry, Invoice, CreditNote, Expense, PaymentReconciliation
from app.core.accounting_engine import AccountingEngine

router = APIRouter()

# --- 1. FINANCIAL SUMMARY & P&L REPORT ---
@router.get("/accounting/profit-and-loss")
def get_profit_and_loss_report(db: Session = Depends(get_db)):
    return AccountingEngine.calculate_profit_and_loss(db)


# --- 2. EXPENSES MANAGEMENT ---
@router.post("/accounting/expenses")
def create_expense(req: ExpenseCreateSchema, db: Session = Depends(get_db)):
    expense = Expense(
        category=req.category,
        description=req.description,
        amount=req.amount,
        tax_amount=req.tax_amount or 0.0,
        vendor_name=req.vendor_name,
        receipt_url=req.receipt_url
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    # Log into Ledger Entry
    AccountingEngine.record_ledger_transaction(
        db, entry_type="expense", amount=req.amount, account_code="5000",
        reference_type="expense", reference_id=expense.id, description=req.description
    )
    return expense


@router.get("/accounting/expenses")
def list_expenses(page: int = 1, limit: int = 20, db: Session = Depends(get_db)):
    offset = (page - 1) * limit
    expenses = db.query(Expense).order_by(Expense.id.desc()).offset(offset).limit(limit).all()
    return expenses


# --- 3. INVOICE GENERATION & MANAGEMENT ---
@router.post("/accounting/invoices")
def create_invoice(req: InvoiceCreateSchema, db: Session = Depends(get_db)):
    inv_num = AccountingEngine.generate_invoice_number()
    invoice = Invoice(
        invoice_number=inv_num,
        order_id=req.order_id,
        customer_id=req.customer_id,
        subtotal=req.subtotal,
        tax_total=req.tax_total,
        discount_total=req.discount_total,
        grand_total=req.grand_total,
        status="issued"
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # Log Revenue and Tax to Central Ledger
    AccountingEngine.record_ledger_transaction(
        db, entry_type="revenue", amount=req.subtotal - req.discount_total, account_code="4000",
        reference_type="order", reference_id=req.order_id, description=f"Sales Revenue for {inv_num}"
    )
    if req.tax_total > 0:
        AccountingEngine.record_ledger_transaction(
            db, entry_type="tax", amount=req.tax_total, account_code="2200",
            reference_type="order", reference_id=req.order_id, description=f"Sales Tax for {inv_num}"
        )

    return invoice


@router.get("/accounting/invoices")
def list_invoices(db: Session = Depends(get_db)):
    return db.query(Invoice).order_by(Invoice.id.desc()).all()


# --- 4. CREDIT NOTES (REFUNDS) ---
@router.post("/accounting/credit-notes")
def create_credit_note(req: CreditNoteCreateSchema, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == req.invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    cn_num = AccountingEngine.generate_credit_note_number()
    credit_note = CreditNote(
        credit_note_number=cn_num,
        invoice_id=req.invoice_id,
        amount=req.amount,
        tax_refunded=req.tax_refunded or 0.0,
        reason=req.reason
    )
    db.add(credit_note)
    invoice.status = "partially_refunded"
    db.commit()
    db.refresh(credit_note)

    # Log Refund to Ledger
    AccountingEngine.record_ledger_transaction(
        db, entry_type="refund", amount=req.amount, account_code="4100",
        reference_type="refund", reference_id=credit_note.id, description=f"Credit Note {cn_num} for Invoice {invoice.invoice_number}"
    )
    return credit_note


# --- 5. PAYMENT RECONCILIATION ---
@router.post("/accounting/reconcile-payment")
def reconcile_payment(req: PaymentReconciliationSchema, db: Session = Depends(get_db)):
    discrepancy = round(req.expected_amount - req.received_amount, 2)
    status_str = "reconciled" if discrepancy == 0 else "discrepancy_flagged"

    reconciliation = PaymentReconciliation(
        order_id=req.order_id,
        gateway_name=req.gateway_name,
        gateway_transaction_id=req.gateway_transaction_id,
        expected_amount=req.expected_amount,
        received_amount=req.received_amount,
        gateway_fee=req.gateway_fee or 0.0,
        discrepancy=discrepancy,
        status=status_str
    )
    db.add(reconciliation)
    db.commit()
    db.refresh(reconciliation)

    return {
        "message": "Payment reconciliation processed.",
        "status": status_str,
        "discrepancy": discrepancy,
        "reconciliation": reconciliation
    }


# --- 6. EXTERNAL ACCOUNTING SOFTWARE INTEGRATION ---
@router.post("/accounting/integrations/sync")
def sync_accounting_data(req: AccountingSyncTriggerSchema):
    result = AccountingEngine.sync_to_external_accounting(
        target_platform=req.target_platform,
        entity_type=req.entity_type,
        payload={"entity_id": req.entity_id}
    )
    return result