from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional

from app.db.base import get_db
from app.middleware.authenticate import admin_required, authenticate
from app.models.user import User
from app.models.role import Role
from app.core.security import verify_password, hash_password
from app.middleware.cloudinary import upload_avatar


router = APIRouter(prefix="/admin", tags=["Admin"])

# ==================== ADMIN PROFILE - 1 API DUY NHẤT ====================
@router.get("/me", dependencies=[Depends(admin_required)])
def get_admin_profile(user: User = Depends(authenticate)):
     return {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
        "avatar": user.avatar,
    }
@router.put("/me", dependencies=[Depends(admin_required)])
async def update_admin_profile(
    # Text fields (optional)
    name: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    
    # File upload (optional)
    avatar: Optional[UploadFile] = File(None),
    
    # Password change (optional) - CHỈ 1 TRƯỜNG
    password: Optional[str] = Form(None),
    
    db: Session = Depends(get_db),
    user: User = Depends(authenticate)
):
    updated_fields = []
    
    # 1️⃣ Update text fields
    if name is not None:
        user.name = name
        updated_fields.append("name")
    
    if phone is not None:
        user.phone = phone
        updated_fields.append("phone")
    
    if address is not None:
        user.address = address
        updated_fields.append("address")
    
    # 2️⃣ Upload avatar
    if avatar is not None:
        avatar_url = await upload_avatar(avatar)
        user.avatar = avatar_url
        updated_fields.append("avatar")
    
    # 3️⃣ Change password - CHỈ CẦN 1 TRƯỜNG
    if password is not None:
        # Validate password
        if len(password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 6 characters"
            )
        
        # Hash và lưu mật khẩu mới
        user.password = hash_password(password)
        updated_fields.append("password")
    
    # 4️⃣ Commit changes
    if updated_fields:
        db.commit()
        db.refresh(user)
        message = f"Updated: {', '.join(updated_fields)}"
    else:
        message = "No fields to update"
    
    return {
        "message": message,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "avatar": user.avatar,
            "role_id": user.role_id,
            "status": user.status
            # Không trả về password!
        }
    }


# ==================== USER MANAGEMENT ====================

@router.get("/users", dependencies=[Depends(admin_required)])
def list_users(db: Session = Depends(get_db)):
    """Admin xem danh sách tất cả users"""
    return db.query(User).all()

@router.get("/users/{user_id}", dependencies=[Depends(admin_required)])
def get_user_detail(user_id: int, db: Session = Depends(get_db)):
    """Admin xem chi tiết 1 user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}", dependencies=[Depends(admin_required)])
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(authenticate)
):
    """Admin xóa user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

