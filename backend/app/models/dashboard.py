from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class AdminWidgetPreference(Base):
    __tablename__ = "admin_widget_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    widget_layout = Column(JSON, nullable=False) # Stores JSON grid positions & visibility
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SystemAlert(Base):
    __tablename__ = "system_alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(50), nullable=False, index=True) # 'inventory', 'order', 'customer'
    severity = Column(String(20), default="warning") # 'info', 'warning', 'critical'
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    reference_id = Column(String(100), nullable=True) # order_id, product_id, user_id
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class GeneratedReport(Base):
    __tablename__ = "generated_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_type = Column(String(50), nullable=False) # 'sales', 'inventory', 'customers'
    file_format = Column(String(20), default="csv") # 'csv', 'json'
    date_range_start = Column(DateTime, nullable=False)
    date_range_end = Column(DateTime, nullable=False)
    download_url = Column(String(255), nullable=True)
    status = Column(String(30), default="completed") # 'pending', 'completed', 'failed'
    created_at = Column(DateTime, default=datetime.utcnow)