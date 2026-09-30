import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.automation import AutomationRule, AutomationLog
from app.models.user import User

logger = logging.getLogger("NexaCommerce.AutomationEngine")

class EventDrivenAutomationEngine:

    @classmethod
    def dispatch_event(cls, db: Session, event_type: str, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Main Event Bus listener that triggers matching automation rules."""
        logger.info(f"Event Dispatched: [{event_type}] with payload: {payload}")
        
        # Fetch matching active rules
        rules = db.query(AutomationRule).filter(
            AutomationRule.event_trigger == event_type,
            AutomationRule.is_active == True
        ).all()

        results = []
        for rule in rules:
            result = cls._evaluate_and_execute(db, rule, payload)
            results.append(result)
            
        return results

    @classmethod
    def _evaluate_and_execute(cls, db: Session, rule: AutomationRule, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluates rule conditions and runs target actions."""
        conditions = rule.conditions or {}
        actions = rule.actions or []
        execution_status = "success"
        executed_actions = []

        # 1. EVALUATE CONDITIONS
        if rule.event_trigger == "stock_low":
            current_stock = payload.get("stock", 0)
            threshold = conditions.get("stock_limit", 5)
            if current_stock >= threshold:
                return cls._log_execution(db, rule, "condition_not_met", f"Stock {current_stock} >= limit {threshold}")

        elif rule.event_trigger == "customer_spend_threshold":
            total_spent = payload.get("total_spent", 0.0)
            target_amount = conditions.get("spent_amount", 500.0)
            if total_spent < target_amount:
                return cls._log_execution(db, rule, "condition_not_met", f"Spent ${total_spent} < threshold ${target_amount}")

        elif rule.event_trigger == "abandoned_cart":
            idle_hours = payload.get("idle_hours", 0)
            target_hours = conditions.get("idle_hours", 2)
            if idle_hours < target_hours:
                return cls._log_execution(db, rule, "condition_not_met", f"Cart idle {idle_hours}h < threshold {target_hours}h")

        # 2. EXECUTE ACTIONS
        for act in actions:
            action_type = act.get("type")
            
            if action_type == "notify_admin":
                executed_actions.append(f"Admin notified regarding {rule.event_trigger}")
                
            elif action_type == "send_abandoned_cart_email":
                user_email = payload.get("email", "customer@example.com")
                executed_actions.append(f"Abandoned cart recovery email sent to {user_email}")
                
            elif action_type == "send_review_request":
                order_id = payload.get("order_id")
                executed_actions.append(f"Review request invitation sent for Order #{order_id}")
                
            elif action_type == "upgrade_vip_customer":
                user_id = payload.get("user_id")
                if user_id:
                    user = db.query(User).filter(User.id == user_id).first()
                    if user:
                        user.role = "vip_customer"
                        executed_actions.append(f"Customer #{user_id} upgraded to VIP Customer status")

        rule.execution_count += 1
        return cls._log_execution(db, rule, "success", executed_actions)

    @classmethod
    def _log_execution(cls, db: Session, rule: AutomationRule, status: str, details: Any) -> Dict[str, Any]:
        log = AutomationLog(
            rule_id=rule.id,
            event_trigger=rule.event_trigger,
            status=status,
            execution_details={"details": details}
        )
        db.add(log)
        db.commit()
        return {"rule_id": rule.id, "rule_name": rule.name, "status": status, "details": details}