from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.auth import LoginRequest, TokenResponse
from app.db.base import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.middleware.authenticate import authenticate

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/admin/login", response_model=TokenResponse)
def admin_login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if user.role.name != "admin": 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not admin"
        )

    token = create_access_token(user.id, user.role.name)
    return {"access_token": token}
@router.post("/admin/logout")
def logout(user=Depends(authenticate)):
    return {
        "message": "Logout successfully"
    }
