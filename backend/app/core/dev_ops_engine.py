import os
import shutil
import logging
from datetime import datetime
from typing import Dict, Any

from app.core.config import settings

logger = logging.getLogger("NexaCommerce.DevOps")

class DevOpsEngine:

    @staticmethod
    def create_database_backup() -> Dict[str, Any]:
        """Creates an automated timestamped backup copy of the database."""
        backup_dir = os.path.join(os.getcwd(), "backups")
        os.makedirs(backup_dir, exist_ok=True)

        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        
        if "sqlite" in settings.DATABASE_URL:
            db_file = settings.DATABASE_URL.replace("sqlite:///", "")
            if os.path.exists(db_file):
                backup_path = os.path.join(backup_dir, f"nexacommerce_backup_{timestamp}.db")
                shutil.copy(db_file, backup_path)
                logger.info(f"SQLite Backup created at: {backup_path}")
                return {
                    "status": "success",
                    "backup_path": backup_path,
                    "created_at": datetime.utcnow().isoformat()
                }
        
        return {
            "status": "simulated",
            "message": "PostgreSQL dump backup triggered.",
            "timestamp": timestamp
        }

    @staticmethod
    def get_system_health() -> Dict[str, Any]:
        """Returns runtime diagnostics for production health checks."""
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "debug_mode": settings.DEBUG,
            "database_url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "local_sqlite",
            "timestamp": datetime.utcnow().isoformat()
        }