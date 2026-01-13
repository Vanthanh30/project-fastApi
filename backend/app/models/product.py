from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Numeric
from app.models.base_model import BaseModel
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Product(BaseModel):
    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(String(255), nullable=False)
    category_id = Column(Integer,ForeignKey("categories.id"), nullable=False)
    price = Column(Numeric(18, 2), nullable=False)
    image = Column(String(500),nullable=True)
    description = Column(String(500))
    brand = Column(String(100))
    quantity = Column(Integer, nullable=False)
    status = Column(Integer, default=1, nullable=False) # 1: Đang bán | 2: Sắp hết hàng | 3: Hết hàng
    created_at: datetime = Column(DateTime, index=True, default=datetime.now)
    updated_at: datetime = Column(DateTime, index=True,onupdate=datetime.now, default=datetime.now)
    deleted_at: datetime = Column(DateTime, index=True)

    category = relationship("Category",back_populates="products")
    