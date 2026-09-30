from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc, extract
from datetime import datetime, timedelta
from typing import Dict, Any, List
import json

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.models.analytics import TrafficSession
from app.models.dashboard import AdminWidgetPreference, SystemAlert, GeneratedReport

class DashboardService:

    @staticmethod
    def get_custom_range_metrics(db: Session, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        orders_query = db.query(Order).filter(
            Order.created_at >= start_date,
            Order.created_at <= end_date,
            Order.status.in_(["completed", "delivered", "processing"])
        )

        revenue = db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).filter(
            Order.created_at >= start_date,
            Order.created_at <= end_date,
            Order.status.in_(["completed", "delivered", "processing"])
        ).scalar()

        orders_count = orders_query.count()

        new_customers = db.query(User).filter(
            User.role == "customer",
            User.created_at >= start_date,
            User.created_at <= end_date
        ).count()

        products_sold = db.query(func.coalesce(func.sum(OrderItem.quantity), 0)).join(
            Order, OrderItem.order_id == Order.id
        ).filter(
            Order.created_at >= start_date,
            Order.created_at <= end_date,
            Order.status.in_(["completed", "delivered", "processing"])
        ).scalar()

        low_stock_count = db.query(Product).filter(Product.stock_quantity <= 5, Product.is_active == True).count()

        sessions_count = db.query(TrafficSession).filter(
            TrafficSession.created_at >= start_date,
            TrafficSession.created_at <= end_date
        ).count()

        conversion_rate = (orders_count / sessions_count * 100) if sessions_count > 0 else 0.0

        return {
            "revenue": float(revenue),
            "orders": orders_count,
            "customers": new_customers,
            "products_sold": int(products_sold),
            "low_stock_items": low_stock_count,
            "conversion_rate": round(conversion_rate, 2),
            "total_traffic_sessions": sessions_count
        }

    @staticmethod
    def get_sales_chart_data(db: Session, start_date: datetime, end_date: datetime, granularity: str = "daily") -> List[Dict[str, Any]]:
        data_points = []
        curr = start_date

        delta = timedelta(days=1)
        if granularity == "hourly":
            delta = timedelta(hours=1)

        while curr <= end_date:
            next_curr = curr + delta
            
            summary = db.query(
                func.coalesce(func.sum(Order.total_amount), 0.0).label("rev"),
                func.count(Order.id).label("cnt")
            ).filter(
                Order.created_at >= curr,
                Order.created_at < next_curr,
                Order.status.in_(["completed", "delivered", "processing"])
            ).first()

            label_fmt = curr.strftime("%Y-%m-%d %H:00") if granularity == "hourly" else curr.strftime("%Y-%m-%d")

            data_points.append({
                "label": label_fmt,
                "revenue": float(summary.rev),
                "orders_count": int(summary.cnt)
            })
            curr = next_curr

        return data_points

    @staticmethod
    def scan_and_generate_alerts(db: Session) -> List[SystemAlert]:
        # Clear old unread auto-scanned alerts to avoid duplicates
        alerts = []

        # 1. Low Stock / Out of Stock Inventory Alerts
        low_stock_products = db.query(Product).filter(Product.stock_quantity <= 3, Product.is_active == True).all()
        for p in low_stock_products:
            existing = db.query(SystemAlert).filter(
                SystemAlert.alert_type == "inventory",
                SystemAlert.reference_id == str(p.id),
                SystemAlert.is_read == False
            ).first()
            if not existing:
                alt = SystemAlert(
                    alert_type="inventory",
                    severity="critical" if p.stock_quantity == 0 else "warning",
                    title=f"Inventory Alert: {p.name}",
                    message=f"Product SKU '{p.sku}' has low stock ({p.stock_quantity} units left).",
                    reference_id=str(p.id)
                )
                db.add(alt)
                alerts.append(alt)

        # 2. High-Value / Unprocessed Orders Alert
        pending_orders = db.query(Order).filter(
            Order.status == "pending",
            Order.total_amount >= 50000 # High value order threshold
        ).all()
        for o in pending_orders:
            existing = db.query(SystemAlert).filter(
                SystemAlert.alert_type == "order",
                SystemAlert.reference_id == str(o.id),
                SystemAlert.is_read == False
            ).first()
            if not existing:
                alt = SystemAlert(
                    alert_type="order",
                    severity="info",
                    title=f"High Value Pending Order: #{o.order_number}",
                    message=f"Order #{o.order_number} worth Rs. {o.total_amount} requires admin verification.",
                    reference_id=str(o.id)
                )
                db.add(alt)
                alerts.append(alt)

        db.commit()
        return db.query(SystemAlert).filter(SystemAlert.is_read == False).order_by(desc(SystemAlert.created_at)).all()

    @staticmethod
    def generate_report_export(db: Session, report_type: str, file_format: str, start_date: datetime, end_date: datetime) -> GeneratedReport:
        # Generate simulated report file path/download URL
        filename = f"report_{report_type}_{start_date.strftime('%Y%m%d')}_{end_date.strftime('%Y%m%d')}.{file_format}"
        download_url = f"/downloads/reports/{filename}"

        report_rec = GeneratedReport(
            report_type=report_type,
            file_format=file_format,
            date_range_start=start_date,
            date_range_end=end_date,
            download_url=download_url,
            status="completed"
        )
        db.add(report_rec)
        db.commit()
        db.refresh(report_rec)
        return report_rec