from pydantic import BaseModel
from typing import List
from decimal import Decimal
from enum import Enum

class PaymentMethod(str, Enum):
    COD = "Thanh toán khi nhận hàng"
    BANK = "Chuyển khoản ngân hàng"
    MOMO = "Ví Momo"
    CARD = "Thẻ tín dụng ghi nợ"

class CreateOrderRequest(BaseModel):
    full_name: str
    phone: str
    email: str
    address: str
    payment_method: PaymentMethod

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    total: float
    status: str
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
