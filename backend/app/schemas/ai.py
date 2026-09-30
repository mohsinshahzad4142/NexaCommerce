from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class DescriptionGenerateRequest(BaseModel):
    title: str
    category: str
    features: Optional[List[str]] = []

class SEOGenerateRequest(BaseModel):
    title: str
    category: str
    description: Optional[str] = ""

class ReviewSummarizeRequest(BaseModel):
    product_id: int
    reviews: List[str]

class ChatAssistantRequest(BaseModel):
    user_message: str
    user_id: Optional[int] = None

class SalesInsightRequest(BaseModel):
    sales_history: List[Dict[str, Any]]