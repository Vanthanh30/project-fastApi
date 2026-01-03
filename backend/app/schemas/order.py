from pydantic import BaseModel
from typing import List
from decimal import Decimal
from app.models.order import PaymentMethod

class CreateOrderRequest(BaseModel):
    full_name: str
    phone: str
    email: str
    address: str
    payment_method: PaymentMethod

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: Decimal

class OrderResponse(BaseModel):
    id: int
    total: Decimal
    status: str
    items: List[OrderItemResponse]
