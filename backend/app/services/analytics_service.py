from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc, extract
from datetime import datetime, timedelta
from typing import Dict, Any, List

from app.models.order import Order, OrderItem, PaymentTransaction
from app.models.product import Product
from app.models.user import User
from app.models.analytics import ProductView, TrafficSession, GA4Config

class AnalyticsService:

    @staticmethod
    def get_sales_metrics(db: Session) -> Dict[str, Any]:
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=7)
        month_start = today_start - timedelta(days=30)
        year_start = today_start - timedelta(days=365)

        # Base query for completed/paid orders
        completed_orders = db.query(Order).filter(Order.status.in_(["completed", "delivered", "processing"]))

        todays_sales = db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).filter(
            Order.created_at >= today_start, Order.status.in_(["completed", "delivered", "processing"])
        ).scalar()

        weekly_sales = db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).filter(
            Order.created_at >= week_start, Order.status.in_(["completed", "delivered", "processing"])
        ).scalar()

        monthly_sales = db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).filter(
            Order.created_at >= month_start, Order.status.in_(["completed", "delivered", "processing"])
        ).scalar()

        yearly_sales = db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).filter(
            Order.created_at >= year_start, Order.status.in_(["completed", "delivered", "processing"])
        ).scalar()

        total_orders_count = completed_orders.count()
        gross_revenue = db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).filter(
            Order.status.in_(["completed", "delivered", "processing"])
        ).scalar()

        avg_order_value = (gross_revenue / total_orders_count) if total_orders_count > 0 else 0.0

        # Refund Calculation from Payment Transactions
        total_refunds = db.query(func.coalesce(func.sum(PaymentTransaction.amount), 0.0)).filter(
            PaymentTransaction.transaction_type == "refund",
            PaymentTransaction.status == "success"
        ).scalar()

        return {
            "todays_sales": float(todays_sales),
            "weekly_sales": float(weekly_sales),
            "monthly_sales": float(monthly_sales),
            "yearly_sales": float(yearly_sales),
            "total_orders": total_orders_count,
            "average_order_value": round(float(avg_order_value), 2),
            "gross_revenue": float(gross_revenue),
            "total_refunds": float(total_refunds)
        }

    @staticmethod
    def get_product_analytics(db: Session, limit: int = 5) -> Dict[str, Any]:
        # Best-selling products
        best_selling_query = db.query(
            OrderItem.product_id,
            Product.name,
            Product.sku,
            func.sum(OrderItem.quantity).label("total_qty"),
            func.sum(OrderItem.total_price).label("total_rev")
        ).join(Product, OrderItem.product_id == Product.id)\
         .group_by(OrderItem.product_id, Product.name, Product.sku)\
         .order_by(desc("total_qty")).limit(limit).all()

        best_selling = [
            {
                "product_id": r[0], "name": r[1], "sku": r[2],
                "quantity_sold": int(r[3]), "revenue_generated": float(r[4]), "view_count": 0
            } for r in best_selling_query
        ]

        # Low-selling active products
        low_selling_query = db.query(
            OrderItem.product_id,
            Product.name,
            Product.sku,
            func.sum(OrderItem.quantity).label("total_qty"),
            func.sum(OrderItem.total_price).label("total_rev")
        ).join(Product, OrderItem.product_id == Product.id)\
         .filter(Product.is_active == True)\
         .group_by(OrderItem.product_id, Product.name, Product.sku)\
         .order_by(asc("total_qty")).limit(limit).all()

        low_selling = [
            {
                "product_id": r[0], "name": r[1], "sku": r[2],
                "quantity_sold": int(r[3]), "revenue_generated": float(r[4]), "view_count": 0
            } for r in low_selling_query
        ]

        # Most viewed products
        most_viewed_query = db.query(
            ProductView.product_id,
            Product.name,
            Product.sku,
            func.count(ProductView.id).label("v_count")
        ).join(Product, ProductView.product_id == Product.id)\
         .group_by(ProductView.product_id, Product.name, Product.sku)\
         .order_by(desc("v_count")).limit(limit).all()

        most_viewed = [
            {
                "product_id": r[0], "name": r[1], "sku": r[2],
                "quantity_sold": 0, "revenue_generated": 0.0, "view_count": int(r[3])
            } for r in most_viewed_query
        ]

        # Out-of-stock products
        out_of_stock_count = db.query(Product).filter(Product.is_active == True, Product.stock_quantity <= 0).count()

        return {
            "best_selling": best_selling,
            "low_selling": low_selling,
            "most_viewed": most_viewed,
            "out_of_stock_count": out_of_stock_count
        }

    @staticmethod
    def get_customer_analytics(db: Session) -> Dict[str, Any]:
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)

        total_customers = db.query(User).filter(User.role == "customer").count()
        new_customers_30d = db.query(User).filter(
            User.role == "customer", User.created_at >= thirty_days_ago
        ).count()

        # Customer Order Counts for Retention Analysis
        customer_orders = db.query(
            Order.user_id, func.count(Order.id).label("order_count")
        ).filter(Order.user_id.isnot(None))\
         .group_by(Order.user_id).all()

        returning_customers = sum(1 for c in customer_orders if c.order_count > 1)
        total_buying_customers = len(customer_orders)

        retention_rate = (returning_customers / total_buying_customers * 100) if total_buying_customers > 0 else 0.0

        # Customer Lifetime Value (CLV)
        total_spent = db.query(func.coalesce(func.sum(Order.total_amount), 0.0)).filter(
            Order.status.in_(["completed", "delivered"])
        ).scalar()

        avg_clv = (total_spent / total_buying_customers) if total_buying_customers > 0 else 0.0

        return {
            "total_customers": total_customers,
            "new_customers_30d": new_customers_30d,
            "returning_customers": returning_customers,
            "retention_rate_pct": round(retention_rate, 2),
            "average_customer_lifetime_value": round(float(avg_clv), 2)
        }

    @staticmethod
    def get_traffic_analytics(db: Session) -> Dict[str, Any]:
        total_sessions = db.query(TrafficSession).count()
        total_visitors = db.query(func.count(func.distinct(TrafficSession.visitor_id))).scalar() or 0

        total_completed_orders = db.query(Order).filter(Order.status.in_(["completed", "delivered"])).count()
        conversion_rate = (total_completed_orders / total_sessions * 100) if total_sessions > 0 else 0.0

        # Traffic Sources
        sources_query = db.query(
            TrafficSession.traffic_source, func.count(TrafficSession.id)
        ).group_by(TrafficSession.traffic_source).all()
        traffic_sources = {s[0]: s[1] for s in sources_query}

        # Device Breakdown
        device_query = db.query(
            TrafficSession.device_type, func.count(TrafficSession.id)
        ).group_by(TrafficSession.device_type).all()
        device_breakdown = {d[0]: d[1] for d in device_query}

        return {
            "total_visitors": total_visitors,
            "total_sessions": total_sessions,
            "conversion_rate_pct": round(conversion_rate, 2),
            "traffic_sources": traffic_sources,
            "device_breakdown": device_breakdown
        }