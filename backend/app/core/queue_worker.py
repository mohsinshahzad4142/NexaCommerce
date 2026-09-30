import logging
import asyncio
from typing import Dict, Any, List, Callable
from datetime import datetime

logger = logging.getLogger("NexaCommerce.QueueWorker")

class BackgroundTaskQueue:
    """Asynchronous Queue Engine for heavy tasks (Emails, Webhooks, Image Compression)."""
    
    _tasks_queue: List[Dict[str, Any]] = []
    _processed_count: int = 0

    @classmethod
    def enqueue(cls, task_type: str, payload: Dict[str, Any], priority: str = "normal") -> str:
        task_id = f"job_{cls._processed_count + len(cls._tasks_queue) + 1}"
        task = {
            "task_id": task_id,
            "task_type": task_type,
            "payload": payload,
            "priority": priority,
            "status": "queued",
            "enqueued_at": datetime.utcnow().isoformat()
        }
        cls._tasks_queue.append(task)
        logger.info(f"Task [{task_id}] '{task_type}' queued with priority '{priority}'")
        return task_id

    @classmethod
    def process_next(cls) -> Optional[Dict[str, Any]]:
        if not cls._tasks_queue:
            return None
        
        task = cls._tasks_queue.pop(0)
        task["status"] = "processing"
        
        # Execute Task Logic
        try:
            logger.info(f"Processing background task [{task['task_id']}] ({task['task_type']})...")
            # Task handlers execution space
            task["status"] = "completed"
            task["completed_at"] = datetime.utcnow().isoformat()
            cls._processed_count += 1
        except Exception as e:
            task["status"] = "failed"
            task["error"] = str(e)
            logger.error(f"Task [{task['task_id']}] failed: {e}")
            
        return task

    @classmethod
    def get_queue_stats(cls) -> Dict[str, Any]:
        return {
            "pending_jobs": len(cls._tasks_queue),
            "completed_jobs": cls._processed_count,
            "queue_status": "healthy"
        }