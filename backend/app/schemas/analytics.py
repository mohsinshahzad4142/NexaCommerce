from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class SalesMetricsResponse(BaseModel):
    todays_sales: float
    weekly_sales: float
    monthly_sales: float
    yearly_sales: float
    total_orders: int
    average_order_value: float
    gross_revenue: float
    total_refunds: float

class ProductPerformanceItem(BaseModel):
    product_id: int
    name: str
    sku: str
    quantity_sold: Optional[int] = 0
    revenue_generated: Optional[float] = 0.0
    view_count: Optional[int] = 0

class ProductAnalyticsResponse(BaseModel):
    best_selling: List[ProductPerformanceItem]
    low_selling: List[ProductPerformanceItem]
    most_viewed: List[ProductPerformanceItem]
    out_of_stock_count: int

class CustomerAnalyticsResponse(BaseModel):
    total_customers: int
    new_customers_30d: int
    returning_customers: int
    retention_rate_pct: float
    average_customer_lifetime_value: float

class TrafficAnalyticsResponse(BaseModel):
    total_visitors: int
    total_sessions: int
    conversion_rate_pct: float
    traffic_sources: Dict[str, int]
    device_breakdown: Dict[str, int]

class GA4ConfigSchema(BaseModel):
    measurement_id: str
    api_secret: Optional[str] = None
    is_active: bool = True

class DashboardOverviewResponse(BaseModel):
    sales: SalesMetricsResponse
    products: ProductAnalyticsResponse
    customers: CustomerAnalyticsResponse
    traffic: TrafficAnalyticsResponse