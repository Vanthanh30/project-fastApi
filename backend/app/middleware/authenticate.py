from fastapi.security import HTTPBearer
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
import jwt
from pydantic import ValidationError

from app.core.config import settings
from app.db.base import get_db
from app.schemas.auth import TokenPayload
from app.models.user import User

reusable_oauth = HTTPBearer()

def authenticate(
    token=Depends(reusable_oauth),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            token.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.PyJWTError, ValidationError):
        raise HTTPException(status_code=403, detail="Invalid credentials")

    user = db.query(User).filter(User.id == token_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user