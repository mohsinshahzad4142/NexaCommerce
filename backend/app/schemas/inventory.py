from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- WAREHOUSE ---
class WarehouseBase(BaseModel):
    name: str
    code: str
    address: Optional[str] = None
    is_active: bool = True

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseResponse(WarehouseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- WAREHOUSE STOCK ---
class StockAdjustmentRequest(BaseModel):
    warehouse_id: int
    product_id: int
    variant_id: Optional[int] = None
    adjustment_type: str  # 'ADD', 'SUBTRACT', 'MARK_DAMAGED', 'RESERVE', 'RELEASE'
    quantity: int
    notes: Optional[str] = None

class WarehouseStockResponse(BaseModel):
    id: int
    warehouse_id: int
    product_id: int
    variant_id: Optional[int] = None
    quantity: int
    reserved_quantity: int
    damaged_quantity: int
    available_quantity: int
    is_low_stock: bool
    reorder_level: int

    class Config:
        from_attributes = True

# --- TRANSACTIONS / AUDIT LOGS ---
class InventoryTransactionResponse(BaseModel):
    id: int
    warehouse_id: int
    product_id: int
    variant_id: Optional[int] = None
    transaction_type: str
    quantity: int
    reference_type: Optional[str] = None
    reference_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- SUPPLIER ---
class SupplierBase(BaseModel):
    name: str
    company_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- PURCHASE ORDERS ---
class PurchaseOrderItemCreate(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    ordered_quantity: int
    unit_cost: float

class PurchaseOrderItemResponse(PurchaseOrderItemCreate):
    id: int
    received_quantity: int

    class Config:
        from_attributes = True

class PurchaseOrderCreate(BaseModel):
    po_number: str
    supplier_id: int
    warehouse_id: int
    expected_delivery: Optional[datetime] = None
    items: List[PurchaseOrderItemCreate]

class PurchaseOrderResponse(BaseModel):
    id: int
    po_number: str
    supplier_id: Optional[int]
    warehouse_id: Optional[int]
    status: str
    total_amount: float
    created_at: datetime
    items: List[PurchaseOrderItemResponse] = []

    class Config:
        from_attributes = True

# --- STOCK TRANSFER ---
class StockTransferItemCreate(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int

class StockTransferCreate(BaseModel):
    transfer_number: str
    from_warehouse_id: int
    to_warehouse_id: int
    notes: Optional[str] = None
    items: List[StockTransferItemCreate]

class StockTransferResponse(BaseModel):
    id: int
    transfer_number: str
    from_warehouse_id: int
    to_warehouse_id: int
    status: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True