from app.models.base_model import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy import Column, String, Float, DateTime, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.role import Role  

class User(BaseModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=True)
    avatar = Column(String(500), nullable=True) 
    address = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    is_verified = Column(Integer, default=0) 
    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", backref="users")
    status: int = Column(Integer, index=True, default=1)
    created_at: datetime = Column(DateTime, index=True, default=datetime.now)
    updated_at: datetime = Column(DateTime, index=True, default=datetime.now)

