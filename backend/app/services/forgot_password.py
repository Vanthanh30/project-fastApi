from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.password_reset_token import PasswordResetToken
from app.utils.send_email import send_reset_password_email
from passlib.context import CryptContext
import secrets
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ForgotPasswordService:
    
    @staticmethod
    def generate_reset_token() -> str:
        """Tạo token ngẫu nhiên"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    async def request_password_reset(db: Session, email: str):
        """Xử lý yêu cầu quên mật khẩu"""
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail="Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu"
            )
    
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.is_used == 0
        ).update({"is_used": 1})

        reset_token = ForgotPasswordService.generate_reset_token()
        db_token = PasswordResetToken(
            user_id=user.id,
            token=reset_token,
            expires_at=PasswordResetToken.get_expiration_time()
        )
        db.add(db_token)
        db.commit()
        try:
            reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
            await send_reset_password_email(
                to_email=user.email,
                user_name=user.name or user.email,
                reset_link=reset_link
            )
        except Exception as e:
            print(f"Lỗi gửi email: {str(e)}")
        
        return {
            "message": "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu",
            "email": email
        }
    
    @staticmethod
    def verify_reset_token(db: Session, token: str) -> PasswordResetToken:
        """Xác thực token reset password"""
        db_token = db.query(PasswordResetToken).filter(
            PasswordResetToken.token == token
        ).first()
        
        if not db_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token không hợp lệ"
            )
        
        if not db_token.is_valid():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token đã hết hạn hoặc đã được sử dụng"
            )
        
        return db_token
    
    @staticmethod
    def reset_password(
        db: Session, 
        token: str, 
        new_password: str, 
        confirm_password: str
    ):
        """Đặt lại mật khẩu"""
        if new_password != confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mật khẩu xác nhận không khớp"
            )

        if len(new_password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mật khẩu phải có ít nhất 6 ký tự"
            )
    
        db_token = ForgotPasswordService.verify_reset_token(db, token)
        user = db.query(User).filter(User.id == db_token.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy người dùng"
            )
        hashed_password = pwd_context.hash(new_password)
        user.password = hashed_password
        db_token.is_used = 1
        
        db.commit()
        
        return {
            "message": "Đặt lại mật khẩu thành công"
        }