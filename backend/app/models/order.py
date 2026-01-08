from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base_model import BaseModel
import enum


class OrderStatus(str, enum.Enum):
    PENDING = "Chờ xác nhận"
    SHIPPING = "Đang giao"
    DONE = "Đã giao"
    CANCEL = "Đã hủy"

class Order(BaseModel):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    address = Column(String(255), nullable=False)

    payment_method = Column(
        String(50),
        nullable=False,
        default="Thanh toán khi nhận hàng"
    )

    status = Column(
        Enum(OrderStatus),
        nullable=False,
        default=OrderStatus.PENDING
    )

    total = Column(Numeric(18, 2), nullable=False)

    created_at = Column(DateTime, default=datetime.now)

    items = relationship("OrderItem", back_populates="order")
    user = relationship("User")
