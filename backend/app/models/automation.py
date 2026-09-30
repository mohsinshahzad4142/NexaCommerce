from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class AutomationRule(Base):
    __tablename__ = "automation_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    event_trigger = Column(String(100), nullable=False, index=True) 
    # Triggers: 'stock_low', 'abandoned_cart', 'order_delivered', 'customer_spend_threshold'
    conditions = Column(JSON, nullable=True) # e.g. {"stock_limit": 5, "spent_amount": 500}
    actions = Column(JSON, nullable=False) # e.g. [{"action": "send_email"}, {"action": "upgrade_vip"}]
    is_active = Column(Boolean, default=True)
    execution_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    logs = relationship("AutomationLog", back_populates="rule", cascade="all, delete-orphan")


class AutomationLog(Base):
    __tablename__ = "automation_logs"

    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey("automation_rules.id", ondelete="CASCADE"), nullable=False, index=True)
    event_trigger = Column(String(100), nullable=False)
    status = Column(String(30), default="success") # 'success', 'failed', 'condition_not_met'
    execution_details = Column(JSON, nullable=True)
    executed_at = Column(DateTime, default=datetime.utcnow)

    rule = relationship("AutomationRule", back_populates="logs")