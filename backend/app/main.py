from fastapi import FastAPI
from app.core.config import settings
from app.db.database import engine, Base
from app.api.v1.router import api_router

# Create database tables if not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.get("/", tags=["default"])
def read_root():
    return {"message": "Welcome to NexaCommerce API"}

@app.get("/health", tags=["default"])
def health_check():
    return {"status": "healthy"}

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)