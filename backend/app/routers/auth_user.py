from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status,UploadFile, File, Form
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
    UserResponse,UserUpdateRequest
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
        subject="Verify your email",
        body=f"""
        <h3>Hello {user.name}</h3>
        <p>Please click the link below to verify your account:</p>
        <a href="{verify_link}">Verify Email</a>
        <p>This link expires in 30 minutes.</p>
        """
    )

    return {
        "message": "Please check your email to verify your account"
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
                content="<h3> Token không hợp lệ</h3>",
                status_code=400
            )

        user_id = payload.get("user_id")

    except PyJWTError:
        return HTMLResponse(
            content="<h3> Token đã hết hạn hoặc không hợp lệ</h3>",
            status_code=400
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return HTMLResponse(
            content="<h3> Người dùng không tồn tại</h3>",
            status_code=404
        )

    if not user.is_verified:
        user.is_verified = 1
        db.commit()

    return HTMLResponse(
        content="""
        <html>
            <head>
                <title>Email Verified</title>
            </head>
            <body style="font-family: Arial; text-align:center; margin-top:80px">
                <h2> Cảm ơn bạn đã xác nhận email!</h2>
                <p>Tài khoản của bạn đã được kích hoạt thành công.</p>
                <a href="http://localhost:5173/login">
                    Đăng nhập ngay
                </a>
            </body>
        </html>
        """,
        status_code=200
    )

@router.post("/login", response_model=TokenResponse)
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Tài khoản chưa tồn tại trong hệ thống"
        )

    if user.role_id != 2:
        raise HTTPException(
            status_code=403,
            detail="Tài khoản admin không được phép đăng nhập tại đây"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in"
        )

    if not user.password or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
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