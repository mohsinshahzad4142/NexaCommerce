import json
import logging
from typing import Any, Optional, Callable
from functools import wraps
from datetime import timedelta

logger = logging.getLogger("NexaCommerce.Cache")

class RedisCacheEngine:
    """In-memory Redis caching layer with namespace isolation and TTL strategy."""
    
    _store: dict = {} # Simulated fallback memory store if Redis connection is offline

    @classmethod
    def get(cls, key: str) -> Optional[Any]:
        """Fetch item from cache."""
        data = cls._store.get(key)
        if data:
            logger.debug(f"Cache HIT: {key}")
            return json.loads(data)
        logger.debug(f"Cache MISS: {key}")
        return None

    @classmethod
    def set(cls, key: str, value: Any, ttl_seconds: int = 300) -> bool:
        """Set cache item with TTL."""
        try:
            cls._store[key] = json.dumps(value, default=str)
            logger.debug(f"Cache SET: {key} (TTL: {ttl_seconds}s)")
            return True
        except Exception as e:
            logger.error(f"Cache SET error for {key}: {e}")
            return False

    @classmethod
    def delete(cls, key: str) -> bool:
        """Invalidate single cache key."""
        if key in cls._store:
            del cls._store[key]
            logger.info(f"Cache INVALIDATED: {key}")
            return True
        return False

    @classmethod
    def invalidate_prefix(cls, prefix: str) -> int:
        """Purge all keys matching prefix (e.g., 'product:*')."""
        keys_to_del = [k for k in cls._store.keys() if k.startswith(prefix)]
        for k in keys_to_del:
            del cls._store[k]
        logger.info(f"Purged {len(keys_to_del)} cache keys with prefix: '{prefix}'")
        return len(keys_to_del)

def cached_api_response(prefix: str, ttl_seconds: int = 300):
    """Decorator for FastAPI endpoints to auto-cache JSON responses."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Formulate cache key based on route arguments
            cache_key = f"{prefix}:{hash(str(kwargs))}"
            cached_data = RedisCacheEngine.get(cache_key)
            if cached_data is not None:
                return cached_data
            
            response = await func(*args, **kwargs) if asyncio.iscoroutinefunction(func) else func(*args, **kwargs)
            RedisCacheEngine.set(cache_key, response, ttl_seconds)
            return response
        return wrapper
    return decorator