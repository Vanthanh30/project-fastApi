from datetime import datetime 
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session, joinedload
from fastapi import Query
from sqlalchemy import or_
from app.db.base import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate,  ProductSearchResponse
from app.models.category import Category
from app.middleware.cloudinary import upload_avatar
from app.middleware.authenticate import admin_required


router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductResponse,dependencies=[Depends(admin_required)])
async def create_product (    
    data: ProductCreate = Depends(ProductCreate.as_form),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db)):

    category = db.query(Category).filter(Category.id == data.category_id).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    
    image_url = None
    if image:
        result = await upload_avatar(image)
        image_url = result["url"]
    
    product = Product(**data.model_dump(exclude_unset=True), image=image_url)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
@router.get("/", response_model=list[ProductResponse])
def get_all_products(db:Session = Depends(get_db)):
    products = db.query(Product)\
        .options(joinedload(Product.category))\
        .filter(Product.deleted_at.is_(None))\
        .all()
    return products
@router.get("/search", response_model=list[ProductSearchResponse])
def search_products(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db)
):
    products = (
        db.query(Product)
        .filter(
            Product.deleted_at.is_(None),
            Product.status == 1,
            or_(
                Product.name.ilike(f"%{q}%"),
                Product.brand.ilike(f"%{q}%"),
                Product.description.ilike(f"%{q}%"),
            )
        )
        .limit(10)
        .all()
    )

    return products
@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product)\
    .options(joinedload(Product.category))\
    .filter(Product.id == product_id, Product.deleted_at.is_(None))\
    .first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product

@router.put("/{product_id}", response_model=ProductResponse,dependencies=[Depends(admin_required)])
async def update_product(
    product_id: int,
    data: ProductUpdate = Depends(ProductUpdate.as_form),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    product = get_product_by_id(product_id, db)
    
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    
    if image:
        result = await upload_avatar(image)
        product.image = result["url"]

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}",dependencies=[Depends(admin_required)])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_by_id(product_id, db)
    product.deleted_at = datetime.now()
    db.commit()
    return {"message": "Delete product success"}