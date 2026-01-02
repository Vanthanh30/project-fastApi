from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.models.base_model import BaseModel

class Category(BaseModel):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    status = Column(Integer, default=1)  # 1: active, 0: inactive
    created_at: datetime = Column(DateTime, index=True, default=datetime.now)
    updated_at: datetime = Column(DateTime, index=True, default=datetime.now)
