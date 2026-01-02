from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
from typing import Optional, List
from app.db.base import get_db
from app.models.category import Category
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse
)

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

# ===================== CREATE =====================
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db)
):
    # check trùng name
    existing = db.execute(
        select(Category).where(Category.name == data.name)
    ).scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category name already exists"
        )

    category = Category(
        name=data.name,
        description=data.description
    )

    db.add(category)
    db.commit()
    db.refresh(category)
    return category


# ===================== GET ALL =====================
@router.get(
    "/",
    response_model=List[CategoryResponse]
)
def get_categories(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    categories = db.execute(
        select(Category)
        .where(Category.status == 1)
        .offset(skip)
        .limit(limit)
    ).scalars().all()

    return categories



# ===================== GET BY ID =====================
@router.get(
    "/{category_id}",
    response_model=CategoryResponse
)
def get_category_by_id(
    category_id: int,
    db: Session = Depends(get_db)
):
    category = db.execute(
        select(Category).where(
            Category.id == category_id,
            Category.status == 1
        )
    ).scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    return category



# ===================== UPDATE =====================
@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db)
):
    category = db.get(Category, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    # ✅ CHỈ LẤY FIELD ĐƯỢC GỬI LÊN
    update_data = data.model_dump(exclude_unset=True)

    # ❌ Nếu không gửi field nào
    if not update_data:
        return category

    # ✅ Check trùng name nếu có gửi name
    if "name" in update_data:
        existing = db.execute(
            select(Category).where(
                Category.name == update_data["name"],
                Category.id != category_id
            )
        ).scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category name already exists"
            )

    # ✅ Update từng field
    for field, value in update_data.items():
        setattr(category, field, value)

    category.updated_at = datetime.now()

    db.commit()
    db.refresh(category)
    return category


# ===================== DELETE (SOFT DELETE) =====================
@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    category = db.get(Category, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    category.status = 0
    category.updated_at = datetime.now()

    db.commit()
    return {"message": "Category deleted successfully"}
