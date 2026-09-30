from sqlalchemy.orm import Session
from typing import Dict, Any, List
import xml.etree.ElementTree as ET
from datetime import datetime

from app.models.product import Product, ProductReview
from app.models.category import Category
from app.models.seo import SEOMetadata

BASE_URL = "https://nexacommerce.com"

class SEOService:
    @staticmethod
    def generate_dynamic_sitemap(db: Session) -> str:
        urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

        # Static Home
        home_url = ET.SubElement(urlset, "url")
        ET.SubElement(home_url, "loc").text = f"{BASE_URL}/"
        ET.SubElement(home_url, "priority").text = "1.0"
        ET.SubElement(home_url, "changefreq").text = "daily"

        # Categories
        categories = db.query(Category).all()
        for cat in categories:
            cat_url = ET.SubElement(urlset, "url")
            ET.SubElement(cat_url, "loc").text = f"{BASE_URL}/category/{cat.slug}"
            ET.SubElement(cat_url, "priority").text = "0.8"
            ET.SubElement(cat_url, "changefreq").text = "weekly"

        # Active Products
        products = db.query(Product).filter(Product.is_active == True).all()
        for prod in products:
            prod_url = ET.SubElement(urlset, "url")
            ET.SubElement(prod_url, "loc").text = f"{BASE_URL}/product/{prod.slug}"
            ET.SubElement(prod_url, "priority").text = "0.9"
            ET.SubElement(prod_url, "changefreq").text = "daily"
            if prod.updated_at:
                ET.SubElement(prod_url, "lastmod").text = prod.updated_at.strftime("%Y-%m-%d")

        return f'<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(urlset, encoding="unicode")

    @staticmethod
    def generate_robots_txt() -> str:
        return (
            "User-agent: *\n"
            "Allow: /\n"
            "Disallow: /admin/\n"
            "Disallow: /api/\n"
            "Disallow: /checkout/\n"
            "Disallow: /cart\n\n"
            f"Sitemap: {BASE_URL}/sitemap.xml\n"
        )

    @staticmethod
    def generate_product_schema(db: Session, product_id: int) -> Dict[str, Any]:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return {}

        reviews = db.query(ProductReview).filter(ProductReview.product_id == product_id, ProductReview.is_approved == True).all()
        review_list = []
        rating_sum = 0
        
        for r in reviews:
            rating_sum += r.rating
            review_list.append({
                "@type": "Review",
                "author": {"@type": "Person", "name": "Customer"},
                "reviewRating": {"@type": "Rating", "ratingValue": str(r.rating), "bestRating": "5"},
                "reviewBody": r.comment or ""
            })

        avg_rating = round(rating_sum / len(reviews), 1) if reviews else 5.0

        schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": [img.image_url for img in product.images] if product.images else [],
            "description": product.description or product.name,
            "sku": product.sku,
            "brand": {
                "@type": "Brand",
                "name": product.brand.name if product.brand else "NexaCommerce"
            },
            "offers": {
                "@type": "Offer",
                "url": f"{BASE_URL}/product/{product.slug}",
                "priceCurrency": "PKR",
                "price": str(product.base_price),
                "availability": "https://schema.org/InStock" if product.is_active else "https://schema.org/OutOfStock"
            }
        }

        if reviews:
            schema["aggregateRating"] = {
                "@type": "AggregateRating",
                "ratingValue": str(avg_rating),
                "reviewCount": str(len(reviews))
            }
            schema["review"] = review_list

        return schema

    @staticmethod
    def generate_organization_schema() -> Dict[str, Any]:
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "NexaCommerce",
            "url": BASE_URL,
            "logo": f"{BASE_URL}/logo.png",
            "sameAs": [
                "https://facebook.com/nexacommerce",
                "https://twitter.com/nexacommerce",
                "https://instagram.com/nexacommerce"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+92-300-0000000",
                "contactType": "customer service"
            }
        }