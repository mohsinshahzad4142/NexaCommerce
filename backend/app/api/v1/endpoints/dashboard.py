from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.db.database import get_db
from app.schemas.dashboard import (
    CustomMetricsOverview, SalesChartResponse, WidgetPreferencesResponse,
    WidgetLayoutConfig, SystemAlertSchema, ReportExportRequest, ReportExportResponse
)
from app.services.dashboard_service import DashboardService
from app.models.dashboard import AdminWidgetPreference, SystemAlert

router = APIRouter()

# DEFAULT LAYOUT FOR DRAG & DROP WIDGETS
DEFAULT_WIDGETS = [
    {"widget_id": "revenue_summary", "title": "Revenue & Orders", "position_x": 0, "position_y": 0, "width": 6, "height": 2, "is_visible": True},
    {"widget_id": "sales_chart", "title": "Sales Performance Chart", "position_x": 6, "position_y": 0, "width": 6, "height": 4, "is_visible": True},
    {"widget_id": "inventory_alerts", "title": "Low Stock Alerts", "position_x": 0, "position_y": 2, "width": 6, "height": 2, "is_visible": True},
    {"widget_id": "traffic_conversion", "title": "Conversion & Traffic", "position_x": 0, "position_y": 4, "width": 12, "height": 3, "is_visible": True}
]

# --- 1. METRICS OVERVIEW WITH CUSTOM DATE RANGE ---
@router.get("/admin/dashboard/metrics", response_model=CustomMetricsOverview)
def get_custom_metrics(
    start_date: str = Query(None, description="Format: YYYY-MM-DD"),
    end_date: str = Query(None, description="Format: YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    start = datetime.strptime(start_date, "%Y-%m-%d") if start_date else (now - timedelta(days=30))
    end = datetime.strptime(end_date, "%Y-%m-%d") if end_date else now

    return DashboardService.get_custom_range_metrics(db, start, end)


# --- 2. SALES CHARTS TIMESERIES DATA ---
@router.get("/admin/dashboard/charts/sales", response_model=SalesChartResponse)
def get_sales_chart(
    start_date: str = Query(None),
    end_date: str = Query(None),
    granularity: str = Query("daily", enum=["hourly", "daily"]),
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    start = datetime.strptime(start_date, "%Y-%m-%d") if start_date else (now - timedelta(days=7))
    end = datetime.strptime(end_date, "%Y-%m-%d") if end_date else now

    points = DashboardService.get_sales_chart_data(db, start, end, granularity)
    return {"granularity": granularity, "data_points": points}


# --- 3. DRAG & DROP WIDGET CONFIGURATION APIs ---
@router.get("/admin/dashboard/widgets", response_model=WidgetPreferencesResponse)
def get_widget_preferences(user_id: int = 1, db: Session = Depends(get_db)):
    pref = db.query(AdminWidgetPreference).filter(AdminWidgetPreference.user_id == user_id).first()
    if not pref:
        return {"widgets": DEFAULT_WIDGETS}
    return {"widgets": pref.widget_layout}


@router.put("/admin/dashboard/widgets")
def update_widget_preferences(widgets: List[WidgetLayoutConfig], user_id: int = 1, db: Session = Depends(get_db)):
    pref = db.query(AdminWidgetPreference).filter(AdminWidgetPreference.user_id == user_id).first()
    layout_data = [w.model_dump() for w in widgets]
    if not pref:
        pref = AdminWidgetPreference(user_id=user_id, widget_layout=layout_data)
        db.add(pref)
    else:
        pref.widget_layout = layout_data
    db.commit()
    return {"message": "Dashboard widget layout saved successfully"}


# --- 4. SYSTEM ALERTS (INVENTORY, ORDERS, CUSTOMERS) ---
@router.get("/admin/dashboard/alerts", response_model=List[SystemAlertSchema])
def get_system_alerts(db: Session = Depends(get_db)):
    return DashboardService.scan_and_generate_alerts(db)


@router.post("/admin/dashboard/alerts/{alert_id}/read")
def mark_alert_read(alert_id: int, db: Session = Depends(get_db)):
    alt = db.query(SystemAlert).filter(SystemAlert.id == alert_id).first()
    if not alt:
        raise HTTPException(status_code=404, detail="Alert not found")
    alt.is_read = True
    db.commit()
    return {"message": "Alert marked as read"}


# --- 5. REPORT GENERATION & EXPORT API ---
@router.post("/admin/dashboard/reports/export", response_model=ReportExportResponse)
def export_report(req: ReportExportRequest, db: Session = Depends(get_db)):
    report = DashboardService.generate_report_export(
        db, req.report_type, req.file_format, req.start_date, req.end_date
    )
    return {
        "report_id": report.id,
        "report_type": report.report_type,
        "status": report.status,
        "download_url": report.download_url,
        "created_at": report.created_at
    }