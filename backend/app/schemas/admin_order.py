
from datetime import datetime
from decimal import Decimal
from typing import List
from pydantic import BaseModel

from app.models.order import OrderStatus

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True
class OrderResponse(BaseModel):
    id: int
    user_id: int 
    full_name: str
    phone: str
    email: str
    address: str
    payment_method: str
    status: OrderStatus
    total: Decimal
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True