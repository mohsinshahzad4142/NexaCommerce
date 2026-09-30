from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.database import get_db
from app.schemas.ai import (
    DescriptionGenerateRequest, SEOGenerateRequest,
    ReviewSummarizeRequest, ChatAssistantRequest, SalesInsightRequest
)
from app.core.ai_engine import AIEngine
from app.models.product import Product

router = APIRouter()

# --- 1. AI PRODUCT DESCRIPTION GENERATOR ---
@router.post("/ai/generate-description")
def generate_description(req: DescriptionGenerateRequest):
    return AIEngine.generate_product_description(req.title, req.category, req.features or [])


# --- 2. AI SEO TITLE & META DESCRIPTION ---
@router.post("/ai/generate-seo")
def generate_seo_meta(req: SEOGenerateRequest):
    return AIEngine.generate_seo_metadata(req.title, req.category, req.description or "")


# --- 3. AI AUTO PRODUCT TAGS ---
@router.post("/ai/generate-tags")
def generate_tags(title: str, category: str):
    tags = AIEngine.extract_product_tags(title, category)
    return {"tags": tags}


# --- 4. AI REVIEW SUMMARIZATION ---
@router.post("/ai/summarize-reviews")
def summarize_reviews(req: ReviewSummarizeRequest):
    return AIEngine.summarize_reviews(req.reviews)


# --- 5. AI SALES INSIGHTS & DEMAND FORECASTING ---
@router.post("/ai/sales-insights")
def sales_insights(req: SalesInsightRequest):
    return AIEngine.generate_sales_insights_and_forecasting(req.sales_history)


# --- 6. AI SHOPPING ASSISTANT & CHATBOT ---
@router.post("/ai/chat-assistant")
def chat_assistant(req: ChatAssistantRequest, db: Session = Depends(get_db)):
    # Fetch top products context from database
    products = db.query(Product).filter(Product.is_active == True).limit(20).all()
    catalog = [{"id": p.id, "name": p.title, "category": "General", "price": p.price} for p in products]

    return AIEngine.chat_shopping_assistant(req.user_message, catalog)


# --- 7. AI SERVICE HEALTH STATUS ---
@router.get("/ai/status")
def ai_service_status():
    enabled = AIEngine.is_ai_enabled()
    return {
        "ai_service_enabled": enabled,
        "mode": "Active AI Engine" if enabled else "Fallback Operational Mode",
        "message": "NexaCommerce store runs seamlessly regardless of AI service status."
    }