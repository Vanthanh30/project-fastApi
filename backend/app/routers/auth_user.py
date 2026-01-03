from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

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


    token = create_access_token(user.id)

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

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }
