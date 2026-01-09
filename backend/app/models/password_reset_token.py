from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from app.models.base_model import BaseModel

class PasswordResetToken(BaseModel):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Integer, default=0)  # MySQL: 0=False, 1=True
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationship
    user = relationship("User", back_populates="password_reset_tokens")

    def is_valid(self):
        """Kiểm tra token còn hiệu lực hay không"""
        return self.is_used == 0 and datetime.now() < self.expires_at

    @staticmethod
    def get_expiration_time():
        """Token hết hạn sau 1 giờ"""
        return datetime.now() + timedelta(hours=1)