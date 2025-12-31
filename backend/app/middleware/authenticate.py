from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
import jwt
from jwt import PyJWTError
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.auth import TokenPayload
from app.db.base import get_db
from app.models.user import User

security = HTTPBearer()

def authenticate(
    token=Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            token.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        data = TokenPayload(**payload)
    except (PyJWTError, ValidationError):
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.status == 0:
        raise HTTPException(status_code=403, detail="User is disabled")

    return user


def admin_required(user: User = Depends(authenticate)):
    if user.role.name != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user
