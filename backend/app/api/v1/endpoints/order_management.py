import json
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.database import get_db
from app.models.order import Order, OrderItem, OrderNote, OrderTimeline
from app.models.inventory import WarehouseStock, InventoryTransaction
from app.schemas.checkout import OrderResponse
from app.schemas.order_management import OrderStatusUpdate, OrderNoteCreate, OrderNoteResponse, OrderTimelineResponse

router = APIRouter()

VALID_STATUSES = [
    "pending", "confirmed", "processing", "packed", 
    "shipped", "delivered", "cancelled", "returned", "refunded", "failed"
]

# --- 1. GET ALL ORDERS WITH ADVANCED FILTERS ---
@router.get("/admin/orders/", response_model=List[OrderResponse])
def get_all_orders_admin(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None, # Order number, email, phone
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Order)

    if status_filter:
        if status_filter.lower() not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status filter. Allowed: {VALID_STATUSES}")
        query = query.filter(Order.status == status_filter.lower())

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Order.order_number.ilike(search_fmt)) |
            (Order.guest_email.ilike(search_fmt)) |
            (Order.guest_phone.ilike(search_fmt))
        )

    return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()


# --- 2. UPDATE ORDER STATUS & TIMELINE ---
@router.patch("/admin/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    req: OrderStatusUpdate,
    changed_by: str = "Admin",
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = req.status.lower()
    if new_status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")

    old_status = order.status
    if old_status == new_status:
        return order

    # Auto Restock Inventory if Cancelled or Returned
    if new_status in ["cancelled", "returned"] and old_status not in ["cancelled", "returned"]:
        for item in order.items:
            stock = db.query(WarehouseStock).filter(
                WarehouseStock.product_id == item.product_id,
                WarehouseStock.variant_id == item.variant_id
            ).first()
            if stock:
                stock.quantity += item.quantity
                db.add(InventoryTransaction(
                    warehouse_id=stock.warehouse_id,
                    product_id=item.product_id,
                    variant_id=item.variant_id,
                    transaction_type="IN",
                    quantity=item.quantity,
                    reference_type="ORDER_RESTOCK",
                    reference_id=order.order_number,
                    notes=f"Restocked due to order status: {new_status}"
                ))

    # Update Order Tracking Info
    if req.tracking_number:
        order.tracking_number = req.tracking_number
    if req.courier_name:
        order.courier_name = req.courier_name

    order.status = new_status
    order.updated_at = datetime.utcnow()

    # Append to Audit Timeline Log
    timeline_entry = OrderTimeline(
        order_id=order.id,
        status_from=old_status,
        status_to=new_status,
        comment=req.comment or f"Status changed from {old_status} to {new_status}",
        changed_by=changed_by
    )
    db.add(timeline_entry)
    db.commit()
    db.refresh(order)
    return order


# --- 3. ORDER NOTES ---
@router.post("/admin/orders/{order_id}/notes", response_model=OrderNoteResponse)
def add_order_note(order_id: int, note_in: OrderNoteCreate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    note = OrderNote(
        order_id=order.id,
        author_role="admin",
        note_text=note_in.note_text,
        is_customer_visible=note_in.is_customer_visible
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("/admin/orders/{order_id}/notes", response_model=List[OrderNoteResponse])
def get_order_notes(order_id: int, db: Session = Depends(get_db)):
    return db.query(OrderNote).filter(OrderNote.order_id == order_id).order_by(OrderNote.created_at.desc()).all()


# --- 4. ORDER TIMELINE AUDIT TRAIL ---
@router.get("/admin/orders/{order_id}/timeline", response_model=List[OrderTimelineResponse])
def get_order_timeline(order_id: int, db: Session = Depends(get_db)):
    return db.query(OrderTimeline).filter(OrderTimeline.order_id == order_id).order_by(OrderTimeline.created_at.asc()).all()


# --- 5. CUSTOMER ORDER HISTORY (ADMIN VIEW & CUSTOMER VIEW) ---
@router.get("/admin/customers/{user_id}/orders", response_model=List[OrderResponse])
def get_customer_orders_admin(user_id: int, db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()


# --- 6. PRINTABLE INVOICE, PACKING SLIP & SHIPPING LABEL ---
@router.get("/admin/orders/{order_id}/invoice", response_class=HTMLResponse)
def generate_invoice_html(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    addr = json.loads(order.shipping_address_json)
    items_rows = "".join([
        f"<tr><td>{i.product_name}</td><td>{i.quantity}</td><td>PKR {i.unit_price}</td><td>PKR {i.total_price}</td></tr>"
        for i in order.items
    ])

    html = f"""
    <html>
    <head><title>Invoice #{order.order_number}</title><style>body{{font-family:Arial;padding:20px;}} table{{width:100%;border-collapse:collapse;margin-top:20px;}} th,td{{border:1px solid #ddd;padding:8px;text-align:left;}}</style></head>
    <body>
        <h2>INVOICE - NexaCommerce</h2>
        <p><strong>Order Number:</strong> #{order.order_number}<br><strong>Date:</strong> {order.created_at.strftime('%Y-%m-%d %H:%M')}<br><strong>Payment Status:</strong> {order.payment_status.upper()}</p>
        <h3>Customer Details:</h3>
        <p>{addr.get('full_name')}<br>{addr.get('address_line1')}, {addr.get('city')}<br>Phone: {addr.get('phone')}</p>
        <table><thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>{items_rows}</tbody></table>
        <h3 style="text-align:right;">Grand Total: PKR {order.grand_total}</h3>
    </body>
    </html>
    """
    return HTMLResponse(content=html)


@router.get("/admin/orders/{order_id}/packing-slip", response_class=HTMLResponse)
def generate_packing_slip_html(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    addr = json.loads(order.shipping_address_json)
    items_rows = "".join([f"<tr><td>[  ]</td><td>{i.product_name} (SKU: {i.sku or 'N/A'})</td><td>{i.quantity}</td></tr>" for i in order.items])

    html = f"""
    <html>
    <head><title>Packing Slip #{order.order_number}</title><style>body{{font-family:Arial;padding:20px;}} table{{width:100%;border-collapse:collapse;margin-top:20px;}} th,td{{border:1px solid #ddd;padding:8px;text-align:left;}}</style></head>
    <body>
        <h2>PACKING SLIP</h2>
        <p><strong>Order #:</strong> {order.order_number} | <strong>Shipping Method:</strong> {order.shipping_method}</p>
        <p><strong>Ship To:</strong> {addr.get('full_name')}, {addr.get('address_line1')}, {addr.get('city')} (Ph: {addr.get('phone')})</p>
        <table><thead><tr><th>Check</th><th>Product & SKU</th><th>Quantity</th></tr></thead><tbody>{items_rows}</tbody></table>
    </body>
    </html>
    """
    return HTMLResponse(content=html)


@router.get("/admin/orders/{order_id}/shipping-label", response_class=HTMLResponse)
def generate_shipping_label_html(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    addr = json.loads(order.shipping_address_json)
    html = f"""
    <html>
    <head><style>.label{{border:3px dashed #000;width:380px;padding:15px;font-family:sans-serif;}}</style></head>
    <body>
        <div class="label">
            <h3>NexaCommerce Express Delivery</h3>
            <hr>
            <p><strong>ORDER #:</strong> {order.order_number}</p>
            <p><strong>COURIER:</strong> {order.courier_name or 'Standard'}</p>
            <p><strong>TRACKING #:</strong> {order.tracking_number or 'PENDING'}</p>
            <hr>
            <p><strong>SHIP TO:</strong><br>{addr.get('full_name')}<br>{addr.get('address_line1')}<br>{addr.get('city')}, {addr.get('country')}<br><strong>Ph:</strong> {addr.get('phone')}</p>
            <hr>
            <h4>COD AMOUNT: PKR {order.grand_total if order.payment_method == 'cod' else '0 (PAID)'}</h4>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html)