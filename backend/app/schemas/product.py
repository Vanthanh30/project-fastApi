from decimal import Decimal
from typing import Optional
from fastapi import Form
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1)
    category_id: int = Field(..., gt=0)
    price: Decimal = Field(..., gt=0)
    description: str = Field(..., min_length=1)
    brand: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)
    status: int = Field(default=1)
    
    @classmethod
    def as_form(
        cls,
        name: str = Form(...),
        category_id: int = Form(...),
        price: Decimal = Form(...),
        description: str = Form(...),
        brand: str = Form(...),
        quantity: int = Form(...),
        status: int = Form(1)
    ):
        return cls(
            name=name,
            category_id=category_id,
            price=price,
            description=description,
            brand=brand,
            quantity=quantity,
            status=status
        )

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = Field(None, gt=0)
    price: Optional[Decimal] = Field(None, gt=0)
    description: Optional[str] = None
    brand: Optional[str] = None
    quantity: Optional[int] = Field(None, gt=0)
    status: Optional[int] = None
    
    @classmethod
    def as_form(
        cls,
        name: Optional[str] = Form(None),
        category_id: Optional[int] = Form(None),
        price: Optional[Decimal] = Form(None),
        description: Optional[str] = Form(None),
        brand: Optional[str] = Form(None),
        quantity: Optional[int] = Form(None),
        status: Optional[int] = Form(None),
    ):
        return cls(
            name=name,
            category_id=category_id,
            price=price,
            description=description,
            brand=brand,
            quantity=quantity,
            status=status,
        )
class CategoryResponse(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True
class ProductResponse(ProductCreate):
    id: int
    image: Optional[str] = None
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
class ProductSearchResponse(BaseModel):
    id: int
    name: str
    price: Decimal
    image: Optional[str] = None
    brand: Optional[str] = None

    class Config:
        from_attributes = True