from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from app.db.database import Base

class StoreSetting(Base):
    __tablename__ = "store_settings"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False, index=True) # 'general', 'currency', 'tax', 'payment', 'email_sms', 'invoice', 'checkout', 'seo'
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(JSON, nullable=True) # Dynamic JSON structure for values, objects, or flags
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)