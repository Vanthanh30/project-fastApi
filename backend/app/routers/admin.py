from fastapi import APIRouter, Depends, HTTPException
from app.middleware.authenticate import authenticate
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/profile")
def admin_profile(current_user: User = Depends(authenticate)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not admin")

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }
