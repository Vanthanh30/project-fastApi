from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.utils.send_email import send_email
from app.db.base import get_db
from app.models.user import User
from app.core.config import settings
from fastapi.responses import HTMLResponse

import jwt
from jwt import PyJWTError
from app.core.security import create_verify_token

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
    UserUpdateRequest
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

from app.middleware.authenticate import authenticate
from app.middleware.cloudinary import upload_avatar
from app.models import user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register_user(data: RegisterRequest, db: Session = Depends(get_db)):

    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role_id=2,
        is_verified=0
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    verify_token = create_verify_token(user.id)
    verify_link = f"http://localhost:8000/auth/verify-email?token={verify_token}"

    await send_email(
        to=user.email,
        subject="Xác nhận email của bạn - LUMIÈRE",
        body=f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #333;">Xin chào {user.name}</h2>
                    <p style="color: #666; font-size: 16px;">
                        Cảm ơn bạn đã đăng ký tài khoản tại LUMIÈRE.
                    </p>
                    <p style="color: #666; font-size: 16px;">
                        Vui lòng click vào nút bên dưới để xác nhận email và kích hoạt tài khoản:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verify_link}" 
                           style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;
                                  font-weight: bold; font-size: 16px;">
                            Xác nhận Email
                        </a>
                    </div>
                    <p style="color: #999; font-size: 14px; margin-top: 20px;">
                        Link này sẽ hết hạn sau 30 phút.
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                        Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
                    </p>
                </div>
            </body>
        </html>
        """
    )

    return {
        "message": "Please check your email to verify your account"
    }


@router.post("/resend-verification")
async def resend_verification(email: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="Email không tồn tại trong hệ thống"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=400, 
            detail="Email đã được xác nhận rồi"
        )
    
    verify_token = create_verify_token(user.id)
    verify_link = f"http://localhost:8000/auth/verify-email?token={verify_token}"
    
    await send_email(
        to=user.email,
        subject="Xác nhận email của bạn - LUMIÈRE",
        body=f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #333;">Xin chào {user.name}</h2>
                    <p style="color: #666; font-size: 16px;">
                        Bạn đã yêu cầu gửi lại email xác nhận tài khoản.
                    </p>
                    <p style="color: #666; font-size: 16px;">
                        Vui lòng click vào nút bên dưới để xác nhận email:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verify_link}" 
                           style="background-color: #4CAF50; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;
                                  font-weight: bold; font-size: 16px;">
                            Xác nhận Email
                        </a>
                    </div>
                    <p style="color: #999; font-size: 14px; margin-top: 20px;">
                        Link này sẽ hết hạn sau 30 phút.
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                        Nếu bạn không yêu cầu email này, vui lòng bỏ qua.
                    </p>
                </div>
            </body>
        </html>
        """
    )
    
    return {
        "message": "Email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư."
    }


@router.get("/verify-email", response_class=HTMLResponse)
def verify_email(token: str, db: Session = Depends(get_db)):

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        if payload.get("type") != "verify":
            return HTMLResponse(
                content="""
                <html>
                    <body style="font-family: Arial; text-align:center; margin-top:80px">
                        <h2 style="color: #f44336;">Token không hợp lệ</h2>
                        <p>Vui lòng sử dụng link xác nhận từ email.</p>
                    </body>
                </html>
                """,
                status_code=400
            )

        user_id = payload.get("user_id")

    except PyJWTError:
        return HTMLResponse(
            content="""
            <html>
                <body style="font-family: Arial; text-align:center; margin-top:80px">
                    <h2 style="color: #f44336;">Token đã hết hạn</h2>
                    <p>Link xác nhận đã hết hạn. Vui lòng yêu cầu gửi lại email xác nhận.</p>
                    <a href="http://localhost:5173/login" 
                       style="display: inline-block; margin-top: 20px; padding: 10px 20px; 
                              background-color: #2196F3; color: white; text-decoration: none; 
                              border-radius: 5px;">
                        Quay lại trang đăng nhập
                    </a>
                </body>
            </html>
            """,
            status_code=400
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return HTMLResponse(
            content="""
            <html>
                <body style="font-family: Arial; text-align:center; margin-top:80px">
                    <h2 style="color: #f44336;">Người dùng không tồn tại</h2>
                    <p>Tài khoản này không còn tồn tại trong hệ thống.</p>
                </body>
            </html>
            """,
            status_code=404
        )

    if not user.is_verified:
        user.is_verified = 1
        db.commit()

    return HTMLResponse(
        content="""
        <html>
            <head>
                <title>Email Verified - LUMIÈRE</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 15px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                        text-align: center;
                        max-width: 500px;
                    }
                    .success-icon {
                        font-size: 60px;
                        color: #4CAF50;
                        margin-bottom: 20px;
                    }
                    h2 {
                        color: #333;
                        margin: 20px 0;
                    }
                    p {
                        color: #666;
                        font-size: 16px;
                        margin: 15px 0;
                    }
                    .btn {
                        display: inline-block;
                        margin-top: 30px;
                        padding: 15px 40px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        font-size: 16px;
                        transition: transform 0.3s ease;
                    }
                    .btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon">✓</div>
                    <h2>Xác nhận email thành công</h2>
                    <p>Tài khoản của bạn đã được kích hoạt.</p>
                    <p>Bạn có thể đăng nhập ngay bây giờ.</p>
                    <a href="http://localhost:5173/login" class="btn">
                        Đăng nhập ngay
                    </a>
                </div>
            </body>
        </html>
        """,
        status_code=200
    )


@router.post("/login", response_model=TokenResponse)
def login_user(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()
    
    if not user or not user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Email chưa được xác nhận. Vui lòng kiểm tra hộp thư và xác nhận email của bạn."
        )
    
    token = create_access_token(user.id, role="user")

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(authenticate)):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_user_me(
    name: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(authenticate)
):

    if name is not None:
        current_user.name = name

    if address is not None:
        current_user.address = address

    if phone is not None:
        current_user.phone = phone
    
    if password is not None:
        if len(password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 6 characters"
            )
        current_user.password = hash_password(password)
    
    if avatar is not None:
        upload_result = await upload_avatar(avatar)
        current_user.avatar = upload_result["url"]

    current_user.updated_at = datetime.now()

    db.commit()
    db.refresh(current_user)

    return current_user