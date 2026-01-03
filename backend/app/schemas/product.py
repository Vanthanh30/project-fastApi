from decimal import Decimal
from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    category_id: int
    price: Decimal
    image: str | None = None
    description: str | None = None
    brand: str
    quantity: int
    status: int

class ProductUpdate(BaseModel):
    name: str | None = None
    category_id: int | None = None
    price: Decimal | None = None
    image: str | None = None
    description: str | None = None
    brand: str | None = None
    quantity: int | None = None
    status: int | None = None

class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True