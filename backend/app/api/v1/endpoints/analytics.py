from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.db.database import get_db
from app.schemas.analytics import (
    DashboardOverviewResponse, SalesMetricsResponse, ProductAnalyticsResponse,
    CustomerAnalyticsResponse, TrafficAnalyticsResponse, GA4ConfigSchema
)
from app.services.analytics_service import AnalyticsService
from app.models.analytics import ProductView, TrafficSession, GA4Config

router = APIRouter()

# --- 1. FULL DASHBOARD OVERVIEW API ---
@router.get("/admin/analytics/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview(db: Session = Depends(get_db)):
    sales = AnalyticsService.get_sales_metrics(db)
    products = AnalyticsService.get_product_analytics(db)
    customers = AnalyticsService.get_customer_analytics(db)
    traffic = AnalyticsService.get_traffic_analytics(db)

    return {
        "sales": sales,
        "products": products,
        "customers": customers,
        "traffic": traffic
    }


# --- 2. INDIVIDUAL METRIC ENDPOINTS ---
@router.get("/admin/analytics/sales", response_model=SalesMetricsResponse)
def get_sales_analytics(db: Session = Depends(get_db)):
    return AnalyticsService.get_sales_metrics(db)


@router.get("/admin/analytics/products", response_model=ProductAnalyticsResponse)
def get_product_analytics(db: Session = Depends(get_db)):
    return AnalyticsService.get_product_analytics(db)


@router.get("/admin/analytics/customers", response_model=CustomerAnalyticsResponse)
def get_customer_analytics(db: Session = Depends(get_db)):
    return AnalyticsService.get_customer_analytics(db)


@router.get("/admin/analytics/traffic", response_model=TrafficAnalyticsResponse)
def get_traffic_analytics(db: Session = Depends(get_db)):
    return AnalyticsService.get_traffic_analytics(db)


# --- 3. PUBLIC TRAFFIC & PRODUCT VIEW TRACKING APIs ---
@router.post("/traffic/track-session")
def track_session(
    session_id: str,
    visitor_id: str,
    traffic_source: str = "direct",
    device_type: str = "desktop",
    browser: str = "chrome",
    db: Session = Depends(get_db)
):
    existing = db.query(TrafficSession).filter(TrafficSession.session_id == session_id).first()
    if existing:
        return {"status": "already_tracked"}

    session_rec = TrafficSession(
        session_id=session_id,
        visitor_id=visitor_id,
        traffic_source=traffic_source,
        device_type=device_type,
        browser=browser
    )
    db.add(session_rec)
    db.commit()
    return {"status": "tracked"}


@router.post("/traffic/track-view/{product_id}")
def track_product_view(
    product_id: int,
    device_type: str = "desktop",
    request: Request = None,
    db: Session = Depends(get_db)
):
    ip_addr = request.client.host if request else None
    view_rec = ProductView(
        product_id=product_id,
        ip_address=ip_addr,
        device_type=device_type
    )
    db.add(view_rec)
    db.commit()
    return {"status": "product_view_logged"}


# --- 4. GA4 INTEGRATION CONFIGURATION ---
@router.post("/admin/analytics/ga4-config")
def save_ga4_config(config_in: GA4ConfigSchema, db: Session = Depends(get_db)):
    db.query(GA4Config).delete()
    ga4_rec = GA4Config(
        measurement_id=config_in.measurement_id,
        api_secret=config_in.api_secret,
        is_active=1 if config_in.is_active else 0
    )
    db.add(ga4_rec)
    db.commit()
    return {"message": "GA4 Integration configured successfully"}


@router.get("/analytics/ga4-config")
def get_ga4_config(db: Session = Depends(get_db)):
    config = db.query(GA4Config).first()
    if not config or not config.is_active:
        return {"active": False, "measurement_id": None}
    return {"active": True, "measurement_id": config.measurement_id}