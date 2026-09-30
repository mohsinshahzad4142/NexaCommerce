import os
import logging
from typing import Dict, Any

logger = logging.getLogger("NexaCommerce.ImageOptimizer")

class ImageOptimizationService:
    """Handles Next-Gen WebP/AVIF Image Conversions, Resizing & CDN URL Rewriting."""

    CDN_BASE_URL = os.getenv("CDN_BASE_URL", "https://cdn.nexacommerce.com")

    @classmethod
    def generate_optimized_urls(cls, original_path: str) -> Dict[str, str]:
        """Convert standard image paths to CDN-cached WebP & AVIF format URLs."""
        if not original_path:
            return {
                "original": f"{cls.CDN_BASE_URL}/assets/placeholder.jpg",
                "webp": f"{cls.CDN_BASE_URL}/assets/placeholder.webp",
                "avif": f"{cls.CDN_BASE_URL}/assets/placeholder.avif",
                "thumbnail_webp": f"{cls.CDN_BASE_URL}/assets/placeholder_thumb.webp"
            }

        base_name, _ = os.path.splitext(original_path)
        
        return {
            "original": f"{cls.CDN_BASE_URL}/{original_path.lstrip('/')}",
            "webp": f"{cls.CDN_BASE_URL}/{base_name.lstrip('/')}.webp",
            "avif": f"{cls.CDN_BASE_URL}/{base_name.lstrip('/')}.avif",
            "thumbnail_webp": f"{cls.CDN_BASE_URL}/{base_name.lstrip('/')}_300x300.webp"
        }

    @classmethod
    def build_responsive_srcset(cls, image_path: str) -> str:
        """Generates HTML/Next.js compatible srcset for responsive storefront loading."""
        urls = cls.generate_optimized_urls(image_path)
        base_webp = urls["webp"]
        return f"{base_webp}?w=400 400w, {base_webp}?w=800 800w, {base_webp}?w=1200 1200w"