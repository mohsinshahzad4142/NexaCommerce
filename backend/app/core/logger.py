import logging
import sys
import json
from datetime import datetime
from app.core.config import settings

class JSONFormatter(logging.Formatter):
    """Formats log records into JSON strings for CloudWatch / Datadog / ELK Stack."""
    def format(self, record):
        log_obj = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "environment": settings.ENVIRONMENT
        }
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)

def setup_logging():
    logger = logging.getLogger("NexaCommerce")
    logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
    
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    
    if not logger.handlers:
        logger.addHandler(handler)
        
    return logger

app_logger = setup_logging()