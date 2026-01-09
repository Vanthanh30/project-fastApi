from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.schemas.forgot_password import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse
)
from app.services.forgot_password import ForgotPasswordService
from app.utils.send_email import send_email

router = APIRouter(prefix="/auth", tags=["Authentication - Password Reset"])

@router.post("/test-email")
async def test_email():
    """Test xem email có gửi được không"""
    try:
        await send_email(
            to="lethanhy220304@gmail.com",
            subject="Test Email từ LUMIÈRE",
            body="<h1>Email hoạt động rồi nhé! </h1><p>Nếu bạn nhận được email này là đã thành công!</p>"
        )
        return {"success": True, "message": "Email đã được gửi! Kiểm tra hộp thư."}
    except Exception as e:
        return {"success": False, "error": f"Lỗi: {str(e)}"}

@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Yêu cầu đặt lại mật khẩu"
)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Gửi email chứa link đặt lại mật khẩu
    
    - **email**: Email đã đăng ký trong hệ thống
    """
    return await ForgotPasswordService.request_password_reset(db, request.email)

@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Đặt lại mật khẩu mới"
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Đặt lại mật khẩu với token từ email
    
    - **token**: Token nhận được từ email
    - **new_password**: Mật khẩu mới (tối thiểu 6 ký tự)
    - **confirm_password**: Xác nhận mật khẩu mới
    """
    return ForgotPasswordService.reset_password(
        db,
        request.token,
        request.new_password,
        request.confirm_password
    )

@router.get(
    "/verify-reset-token/{token}",
    status_code=status.HTTP_200_OK,
    summary="Kiểm tra token có hợp lệ không"
)
def verify_reset_token(
    token: str,
    db: Session = Depends(get_db)
):
    """
    Kiểm tra token đặt lại mật khẩu có hợp lệ không
    
    - **token**: Token cần kiểm tra
    """
    ForgotPasswordService.verify_reset_token(db, token)
    return {"message": "Token hợp lệ", "valid": True}