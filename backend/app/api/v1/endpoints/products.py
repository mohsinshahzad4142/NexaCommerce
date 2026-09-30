import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.database import get_db
from app.models.product import Product, ProductImage, ProductVariant, ProductSpecification, Tag
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse,
    BulkStatusUpdate, BulkPriceUpdate, BulkStockUpdate,
    BulkCategoryAssign, BulkDeleteRequest
)

router = APIRouter()

# --- 1. SINGLE PRODUCT MANAGEMENT ---

@router.post("/products/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    product_data = product_in.dict()
    images_data = product_data.pop("images", [])
    variants_data = product_data.pop("variants", [])
    specs_data = product_data.pop("specifications", [])
    tags_data = product_data.pop("tags", [])

    db_product = Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    for img in images_data:
        db.add(ProductImage(product_id=db_product.id, **img))
    for var in variants_data:
        db.add(ProductVariant(product_id=db_product.id, **var))
    for spec in specs_data:
        db.add(ProductSpecification(product_id=db_product.id, **spec))

    # Handle Tags
    for tag_name in tags_data:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name, slug=tag_name.lower().replace(" ", "-"))
            db.add(tag)
            db.commit()
            db.refresh(tag)
        db_product.tags.append(tag)

    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/products/{product_id}", response_model=ProductResponse)
def edit_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)

    db_product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/products/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": f"Product {product_id} deleted successfully"}


@router.post("/products/{product_id}/duplicate", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def duplicate_product(product_id: int, db: Session = Depends(get_db)):
    original = db.query(Product).filter(Product.id == product_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Product not found")

    new_sku = f"{original.sku}-COPY-{int(datetime.utcnow().timestamp())}"
    new_slug = f"{original.slug}-copy-{int(datetime.utcnow().timestamp())}"

    duplicated_product = Product(
        name=f"{original.name} (Copy)",
        slug=new_slug,
        sku=new_sku,
        barcode=original.barcode,
        short_description=original.short_description,
        description=original.description,
        regular_price=original.regular_price,
        sale_price=original.sale_price,
        stock_quantity=original.stock_quantity,
        status="draft",  # Duplicated products default to draft
        category_id=original.category_id,
        brand_id=original.brand_id,
        featured_image=original.featured_image
    )
    
    db.add(duplicated_product)
    db.commit()
    db.refresh(duplicated_product)
    return duplicated_product


@router.get("/products/", response_model=List[ProductResponse])
def search_and_filter_products(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    status: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_featured: Optional[bool] = None,
    sort_by: Optional[str] = Query("created_at", enum=["price_asc", "price_desc", "created_at", "name"]),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if search:
        query = query.filter((Product.name.ilike(f"%{search}%")) | (Product.sku.ilike(f"%{search}%")))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if brand_id:
        query = query.filter(Product.brand_id == brand_id)
    if status:
        query = query.filter(Product.status == status)
    if min_price is not None:
        query = query.filter(Product.regular_price >= min_price)
    if max_price is not None:
        query = query.filter(Product.regular_price <= max_price)
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)

    if sort_by == "price_asc":
        query = query.order_by(Product.regular_price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.regular_price.desc())
    elif sort_by == "name":
        query = query.order_by(Product.name.asc())
    else:
        query = query.order_by(Product.created_at.desc())

    return query.offset(skip).limit(limit).all()


@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# --- 2. BULK MANAGEMENT OPERATIONS ---

@router.post("/products/bulk/update-status")
def bulk_update_status(payload: BulkStatusUpdate, db: Session = Depends(get_db)):
    db.query(Product).filter(Product.id.in_(payload.product_ids)).update({"status": payload.status}, synchronize_session=False)
    db.commit()
    return {"message": f"Updated status to {payload.status} for {len(payload.product_ids)} products"}


@router.post("/products/bulk/update-prices")
def bulk_update_prices(payload: BulkPriceUpdate, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.id.in_(payload.product_ids)).all()
    for product in products:
        if payload.fixed_regular_price is not None:
            product.regular_price = payload.fixed_regular_price
        elif payload.percentage_change is not None:
            product.regular_price = round(product.regular_price * (1 + payload.percentage_change / 100), 2)
    db.commit()
    return {"message": f"Updated prices for {len(products)} products"}


@router.post("/products/bulk/update-stock")
def bulk_update_stock(payload: BulkStockUpdate, db: Session = Depends(get_db)):
    db.query(Product).filter(Product.id.in_(payload.product_ids)).update({"stock_quantity": payload.stock_quantity}, synchronize_session=False)
    db.commit()
    return {"message": f"Updated stock to {payload.stock_quantity} for {len(payload.product_ids)} products"}


@router.post("/products/bulk/assign-category")
def bulk_assign_category(payload: BulkCategoryAssign, db: Session = Depends(get_db)):
    db.query(Product).filter(Product.id.in_(payload.product_ids)).update({"category_id": payload.category_id}, synchronize_session=False)
    db.commit()
    return {"message": f"Assigned category {payload.category_id} to {len(payload.product_ids)} products"}


@router.post("/products/bulk/delete")
def bulk_delete_products(payload: BulkDeleteRequest, db: Session = Depends(get_db)):
    deleted_count = db.query(Product).filter(Product.id.in_(payload.product_ids)).delete(synchronize_session=False)
    db.commit()
    return {"message": f"Successfully deleted {deleted_count} products"}


# --- 3. CSV IMPORT / EXPORT ---

@router.get("/products/export/csv")
def export_products_csv(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "sku", "regular_price", "sale_price", "stock_quantity", "status"])

    for p in products:
        writer.writerow([p.id, p.name, p.sku, p.regular_price, p.sale_price, p.stock_quantity, p.status])

    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=products_export.csv"})


@router.post("/products/import/csv")
def import_products_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    contents = file.file.read().decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(contents))
    
    created_count = 0
    for row in csv_reader:
        db_product = Product(
            name=row["name"],
            sku=row["sku"],
            slug=row["sku"].lower().replace(" ", "-"),
            regular_price=float(row.get("regular_price", 0)),
            sale_price=float(row["sale_price"]) if row.get("sale_price") else None,
            stock_quantity=int(row.get("stock_quantity", 0)),
            status=row.get("status", "draft")
        )
        db.add(db_product)
        created_count += 1

    db.commit()
    return {"message": f"Successfully imported {created_count} products from CSV"}