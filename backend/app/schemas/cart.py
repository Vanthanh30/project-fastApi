from pydantic import BaseModel
from typing import List,Optional 

class AddToCartRequest(BaseModel):
    product_id: int
    quantity: int = 1

class UpdateCartItemRequest(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    name: str
    image: Optional[str] = None 
    price: float
    quantity: int
    total: float  

    class Config:
        orm_mode = True

class CartResponse(BaseModel):
    total_cart: float
    items: List[CartItemResponse] = []

    class Config:
        orm_mode = True