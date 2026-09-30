from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.database import get_db
from app.models.inventory import (
    Warehouse, WarehouseStock, InventoryTransaction,
    Supplier, PurchaseOrder, PurchaseOrderItem,
    StockTransfer, StockTransferItem
)
from app.models.product import Product, ProductVariant
from app.schemas.inventory import (
    WarehouseCreate, WarehouseResponse,
    StockAdjustmentRequest, WarehouseStockResponse,
    InventoryTransactionResponse,
    SupplierCreate, SupplierResponse,
    PurchaseOrderCreate, PurchaseOrderResponse,
    StockTransferCreate, StockTransferResponse
)

router = APIRouter()

# --- WAREHOUSES ---
@router.post("/warehouses/", response_model=WarehouseResponse, status_code=status.HTTP_201_CREATED)
def create_warehouse(warehouse_in: WarehouseCreate, db: Session = Depends(get_db)):
    db_wh = Warehouse(**warehouse_in.dict())
    db.add(db_wh)
    db.commit()
    db.refresh(db_wh)
    return db_wh

@router.get("/warehouses/", response_model=List[WarehouseResponse])
def get_warehouses(db: Session = Depends(get_db)):
    return db.query(Warehouse).all()


# --- STOCK MANAGEMENT & ADJUSTMENTS ---
@router.get("/inventory/stock", response_model=List[WarehouseStockResponse])
def get_inventory_stock(
    warehouse_id: Optional[int] = None,
    product_id: Optional[int] = None,
    low_stock_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(WarehouseStock)
    if warehouse_id:
        query = query.filter(WarehouseStock.warehouse_id == warehouse_id)
    if product_id:
        query = query.filter(WarehouseStock.product_id == product_id)

    results = query.all()
    out = []
    for item in results:
        avail = item.quantity - item.reserved_quantity - item.damaged_quantity
        is_low = avail <= item.reorder_level
        if low_stock_only and not is_low:
            continue
        out.append({
            "id": item.id,
            "warehouse_id": item.warehouse_id,
            "product_id": item.product_id,
            "variant_id": item.variant_id,
            "quantity": item.quantity,
            "reserved_quantity": item.reserved_quantity,
            "damaged_quantity": item.damaged_quantity,
            "available_quantity": avail,
            "is_low_stock": is_low,
            "reorder_level": item.reorder_level
        })
    return out


@router.post("/inventory/adjust", response_model=WarehouseStockResponse)
def adjust_stock(req: StockAdjustmentRequest, db: Session = Depends(get_db)):
    stock = db.query(WarehouseStock).filter(
        WarehouseStock.warehouse_id == req.warehouse_id,
        WarehouseStock.product_id == req.product_id,
        WarehouseStock.variant_id == req.variant_id
    ).first()

    if not stock:
        stock = WarehouseStock(
            warehouse_id=req.warehouse_id,
            product_id=req.product_id,
            variant_id=req.variant_id,
            quantity=0
        )
        db.add(stock)
        db.commit()
        db.refresh(stock)

    tx_type = req.adjustment_type.upper()
    if tx_type == "ADD":
        stock.quantity += req.quantity
    elif tx_type == "SUBTRACT":
        if stock.quantity < req.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock to subtract")
        stock.quantity -= req.quantity
    elif tx_type == "MARK_DAMAGED":
        stock.damaged_quantity += req.quantity
    elif tx_type == "RESERVE":
        stock.reserved_quantity += req.quantity
    elif tx_type == "RELEASE":
        stock.reserved_quantity = max(0, stock.reserved_quantity - req.quantity)
    else:
        raise HTTPException(status_code=400, detail="Invalid adjustment_type")

    # Audit Transaction Log
    tx = InventoryTransaction(
        warehouse_id=req.warehouse_id,
        product_id=req.product_id,
        variant_id=req.variant_id,
        transaction_type=tx_type,
        quantity=req.quantity,
        reference_type="MANUAL_ADJUSTMENT",
        notes=req.notes
    )
    db.add(tx)
    
    # Sync Global Product Stock
    total_qty = db.query(WarehouseStock).filter(WarehouseStock.product_id == req.product_id).all()
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if product:
        product.stock_quantity = sum([s.quantity for s in total_qty])

    db.commit()
    db.refresh(stock)

    avail = stock.quantity - stock.reserved_quantity - stock.damaged_quantity
    return {
        "id": stock.id,
        "warehouse_id": stock.warehouse_id,
        "product_id": stock.product_id,
        "variant_id": stock.variant_id,
        "quantity": stock.quantity,
        "reserved_quantity": stock.reserved_quantity,
        "damaged_quantity": stock.damaged_quantity,
        "available_quantity": avail,
        "is_low_stock": avail <= stock.reorder_level,
        "reorder_level": stock.reorder_level
    }


@router.get("/inventory/transactions", response_model=List[InventoryTransactionResponse])
def get_inventory_transactions(product_id: Optional[int] = None, limit: int = 50, db: Session = Depends(get_db)):
    query = db.query(InventoryTransaction)
    if product_id:
        query = query.filter(InventoryTransaction.product_id == product_id)
    return query.order_by(InventoryTransaction.created_at.desc()).limit(limit).all()


# --- SUPPLIERS & PURCHASE ORDERS ---
@router.post("/suppliers/", response_model=SupplierResponse)
def create_supplier(supplier_in: SupplierCreate, db: Session = Depends(get_db)):
    db_sup = Supplier(**supplier_in.dict())
    db.add(db_sup)
    db.commit()
    db.refresh(db_sup)
    return db_sup

@router.get("/suppliers/", response_model=List[SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()


@router.post("/purchase-orders/", response_model=PurchaseOrderResponse)
def create_purchase_order(po_in: PurchaseOrderCreate, db: Session = Depends(get_db)):
    po_data = po_in.dict()
    items_data = po_data.pop("items", [])
    
    total_amt = sum([item["ordered_quantity"] * item["unit_cost"] for item in items_data])
    po = PurchaseOrder(**po_data, total_amount=total_amt)
    db.add(po)
    db.commit()
    db.refresh(po)

    for item in items_data:
        db.add(PurchaseOrderItem(po_id=po.id, **item))

    db.commit()
    db.refresh(po)
    return po


@router.post("/purchase-orders/{po_id}/receive")
def receive_purchase_order(po_id: int, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    if po.status == "received":
        raise HTTPException(status_code=400, detail="PO already received")

    for item in po.items:
        item.received_quantity = item.ordered_quantity
        
        # Increase Stock
        stock = db.query(WarehouseStock).filter(
            WarehouseStock.warehouse_id == po.warehouse_id,
            WarehouseStock.product_id == item.product_id,
            WarehouseStock.variant_id == item.variant_id
        ).first()

        if not stock:
            stock = WarehouseStock(
                warehouse_id=po.warehouse_id,
                product_id=item.product_id,
                variant_id=item.variant_id,
                quantity=item.ordered_quantity
            )
            db.add(stock)
        else:
            stock.quantity += item.ordered_quantity

        # Create Inventory IN Audit
        db.add(InventoryTransaction(
            warehouse_id=po.warehouse_id,
            product_id=item.product_id,
            variant_id=item.variant_id,
            transaction_type="IN",
            quantity=item.ordered_quantity,
            reference_type="PO",
            reference_id=po.po_number,
            notes="Received Purchase Order"
        ))

    po.status = "received"
    po.updated_at = datetime.utcnow()
    db.commit()
    return {"message": f"PO {po.po_number} marked as received and stocks updated."}


# --- STOCK TRANSFERS ---
@router.post("/stock-transfers/", response_model=StockTransferResponse)
def execute_stock_transfer(transfer_in: StockTransferCreate, db: Session = Depends(get_db)):
    data = transfer_in.dict()
    items_data = data.pop("items", [])

    if data["from_warehouse_id"] == data["to_warehouse_id"]:
        raise HTTPException(status_code=400, detail="Source and destination warehouse cannot be same")

    transfer = StockTransfer(**data, status="completed", completed_at=datetime.utcnow())
    db.add(transfer)
    db.commit()
    db.refresh(transfer)

    for item in items_data:
        # Subtract from Source
        from_stock = db.query(WarehouseStock).filter(
            WarehouseStock.warehouse_id == data["from_warehouse_id"],
            WarehouseStock.product_id == item["product_id"],
            WarehouseStock.variant_id == item["variant_id"]
        ).first()
        if not from_stock or from_stock.quantity < item["quantity"]:
            raise HTTPException(status_code=400, detail=f"Insufficient stock in source warehouse for product ID {item['product_id']}")

        from_stock.quantity -= item["quantity"]

        # Add to Destination
        to_stock = db.query(WarehouseStock).filter(
            WarehouseStock.warehouse_id == data["to_warehouse_id"],
            WarehouseStock.product_id == item["product_id"],
            WarehouseStock.variant_id == item["variant_id"]
        ).first()

        if not to_stock:
            to_stock = WarehouseStock(
                warehouse_id=data["to_warehouse_id"],
                product_id=item["product_id"],
                variant_id=item["variant_id"],
                quantity=item["quantity"]
            )
            db.add(to_stock)
        else:
            to_stock.quantity += item["quantity"]

        db.add(StockTransferItem(transfer_id=transfer.id, **item))

    db.commit()
    db.refresh(transfer)
    return transfer