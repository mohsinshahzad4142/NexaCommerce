from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DateRangeFilter(BaseModel):
    start_date: datetime
    end_date: datetime
    granularity: Optional[str] = "daily" # 'hourly', 'daily', 'monthly'

class CustomMetricsOverview(BaseModel):
    revenue: float
    orders: int
    customers: int
    products_sold: int
    low_stock_items: int
    conversion_rate: float
    total_traffic_sessions: int

class TimeseriesDataPoint(BaseModel):
    label: str
    revenue: float
    orders_count: int

class SalesChartResponse(BaseModel):
    granularity: str
    data_points: List[TimeseriesDataPoint]

class WidgetLayoutConfig(BaseModel):
    widget_id: str
    title: str
    position_x: int
    position_y: int
    width: int
    height: int
    is_visible: bool

class WidgetPreferencesResponse(BaseModel):
    widgets: List[WidgetLayoutConfig]

class SystemAlertSchema(BaseModel):
    id: int
    alert_type: str
    severity: str
    title: str
    message: str
    reference_id: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ReportExportRequest(BaseModel):
    report_type: str # 'sales', 'inventory', 'customers'
    file_format: Optional[str] = "csv"
    start_date: datetime
    end_date: datetime

class ReportExportResponse(BaseModel):
    report_id: int
    report_type: str
    status: str
    download_url: str
    created_at: datetime