from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class ChatRequest(BaseModel):
    message: str

class ProductOut(BaseModel):
    id: int
    name: str
    price: Decimal
    brand: Optional[str]
    category: Optional[str]

class ChatResponse(BaseModel):
    reply: str
    products: List[ProductOut]
