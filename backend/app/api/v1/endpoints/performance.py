from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from app.db.database import get_db
from app.core.cache_engine import RedisCacheEngine
from app.core.queue_worker import BackgroundTaskQueue
from app.core.image_optimizer import ImageOptimizationService
from app.models.product import Product
from app.core.pagination import PaginationHelper

router = APIRouter()

# --- 1. CACHE MANAGEMENT APIs ---
@router.post("/performance/cache/clear")
def clear_cache(prefix: str = Query("product", description="Cache key prefix to invalidate")):
    count = RedisCacheEngine.invalidate_prefix(prefix)
    return {"message": f"Purged {count} cached items matching prefix '{prefix}'."}


@router.get("/performance/cache/stats")
def get_cache_stats():
    return {
        "cached_keys_count": len(RedisCacheEngine._store),
        "status": "active",
        "engine": "Redis In-Memory Accelerator"
    }


# --- 2. BACKGROUND QUEUE APIs ---
@router.get("/performance/queue/status")
def get_queue_status():
    return BackgroundTaskQueue.get_queue_stats()


@router.post("/performance/queue/trigger-test-job")
def trigger_background_job(task_type: str = "image_optimization", background_tasks: BackgroundTasks = None):
    job_id = BackgroundTaskQueue.enqueue(
        task_type=task_type,
        payload={"sample_file": "product_banner.jpg", "target_formats": ["webp", "avif"]}
    )
    # Trigger execution
    BackgroundTaskQueue.process_next()
    return {"message": "Background job enqueued and processed.", "job_id": job_id}


# --- 3. CDN & IMAGE OPTIMIZATION TEST API ---
@router.get("/performance/image/optimize-url")
def optimize_image_path(path: str = Query("/uploads/products/sneakers.jpg")):
    urls = ImageOptimizationService.generate_optimized_urls(path)
    srcset = ImageOptimizationService.build_responsive_srcset(path)
    return {
        "formats": urls,
        "responsive_srcset": srcset,
        "cdn_provider": "Cloudflare / NexaCommerce Edge CDN"
    }


# --- 4. OPTIMIZED FAST PAGINATED PRODUCTS ---
@router.get("/performance/fast-products")
def get_fast_paginated_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True).order_by(Product.id.desc())
    items, meta = PaginationHelper.paginate_query(query, page, limit)

    # Transform images to WebP CDN format on the fly
    formatted_items = []
    for item in items:
        formatted_items.append({
            "id": item.id,
            "title": item.title,
            "price": item.price,
            "stock": item.stock,
            "optimized_images": ImageOptimizationService.generate_optimized_urls(f"/uploads/products/{item.id}.jpg")
        })

    return {"data": formatted_items, "pagination": meta.dict()}