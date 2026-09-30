from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.seo import SEOMetadata, RedirectRule
from app.schemas.seo import (
    SEOMetadataUpsert, SEOMetadataResponse, RedirectRuleCreate, RedirectRuleResponse
)
from app.services.seo_service import SEOService

router = APIRouter()

# --- 1. DYNAMIC XML SITEMAP & ROBOTS.TXT ---
@router.get("/sitemap.xml", response_class=Response)
def get_sitemap(db: Session = Depends(get_db)):
    xml_content = SEOService.generate_dynamic_sitemap(db)
    return Response(content=xml_content, media_type="application/xml")


@router.get("/robots.txt", response_class=Response)
def get_robots_txt():
    robots_content = SEOService.generate_robots_txt()
    return Response(content=robots_content, media_type="text/plain")


# --- 2. STRUCTURED DATA / SCHEMA.ORG APIS ---
@router.get("/seo/schema/product/{product_id}")
def get_product_json_ld(product_id: int, db: Session = Depends(get_db)):
    schema = SEOService.generate_product_schema(db, product_id)
    if not schema:
        raise HTTPException(status_code=404, detail="Product schema not found")
    return schema


@router.get("/seo/schema/organization")
def get_organization_json_ld():
    return SEOService.generate_organization_schema()


# --- 3. CUSTOM METADATA OVERRIDES ---
@router.post("/admin/seo/metadata", response_model=SEOMetadataResponse)
def upsert_seo_metadata(meta_in: SEOMetadataUpsert, db: Session = Depends(get_db)):
    existing = db.query(SEOMetadata).filter(
        SEOMetadata.entity_type == meta_in.entity_type,
        SEOMetadata.entity_id == meta_in.entity_id
    ).first()

    if existing:
        for field, value in meta_in.dict(exclude_unset=True).items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    new_meta = SEOMetadata(**meta_in.dict())
    db.add(new_meta)
    db.commit()
    db.refresh(new_meta)
    return new_meta


# --- 4. 301/302 REDIRECT MANAGER ---
@router.post("/admin/seo/redirects", response_model=RedirectRuleResponse)
def create_redirect_rule(rule_in: RedirectRuleCreate, db: Session = Depends(get_db)):
    existing = db.query(RedirectRule).filter(RedirectRule.source_path == rule_in.source_path).first()
    if existing:
        raise HTTPException(status_code=400, detail="Redirect rule for this source path already exists")

    rule = RedirectRule(**rule_in.dict())
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


@router.get("/seo/redirect-check")
def check_redirect(path: str, db: Session = Depends(get_db)):
    rule = db.query(RedirectRule).filter(RedirectRule.source_path == path, RedirectRule.is_active == True).first()
    if not rule:
        return {"has_redirect": False}
    return {
        "has_redirect": True,
        "target_path": rule.target_path,
        "status_code": rule.status_code
    }