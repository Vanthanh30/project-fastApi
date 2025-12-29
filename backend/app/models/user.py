from app.models.base_model import BaseModel
from sqlalchemy import Column, Integer, String
from sqlalchemy import Column, String, Float, DateTime, Integer
from datetime import datetime

class User(BaseModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="user")  # admin | user
    status: int = Column(Integer, index=True, default=1)
    created_at: datetime = Column(DateTime, index=True, default=datetime.now)
    updated_at: datetime = Column(DateTime, index=True, default=datetime.now)
