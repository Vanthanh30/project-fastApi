from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status,UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.db.base import get_db
from app.models.user import User

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

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):

    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role_id=2  
    )

    db.add(user)
    db.commit()
    db.refresh(user)


    token = create_access_token(user.id, role="user")

    return {
        "access_token": token,
        "token_type": "bearer"
    }


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
    # ✅ Update text fields
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
    # ✅ Update avatar nếu có upload
    if avatar is not None:
        upload_result = await upload_avatar(avatar)
        current_user.avatar = upload_result["url"]


    current_user.updated_at = datetime.now()

    db.commit()
    db.refresh(current_user)

    return current_user