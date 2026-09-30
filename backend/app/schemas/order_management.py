from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrderStatusUpdate(BaseModel):
    status: str  # 'pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded', 'failed'
    comment: Optional[str] = None
    tracking_number: Optional[str] = None
    courier_name: Optional[str] = None

class OrderNoteCreate(BaseModel):
    note_text: str
    is_customer_visible: bool = False

class OrderNoteResponse(BaseModel):
    id: int
    author_role: str
    note_text: str
    is_customer_visible: bool
    created_at: datetime

    class Config:
        from_attributes = True

class OrderTimelineResponse(BaseModel):
    id: int
    status_from: Optional[str]
    status_to: str
    comment: Optional[str]
    changed_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class PrintableDocumentResponse(BaseModel):
    document_type: str  # 'invoice', 'packing_slip', 'shipping_label'
    order_number: str
    created_at: datetime
    html_content: str