from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.oauth import oauth
from app.db.base import get_db
from app.utils.auth_google import get_or_create_google_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/google")
async def login_google(request: Request):
    redirect_uri = "http://localhost:8000/auth/google/callback"

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri,

        prompt="select_account",
        access_type="offline",
        include_granted_scopes="false",
    )

@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        # 1️⃣ Lấy access_token + id_token
        token = await oauth.google.authorize_access_token(request)

        # 2️⃣ Lấy user info từ Google
        resp = await oauth.google.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            token=token
        )
        user_info = resp.json()

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3️⃣ Lưu user vào DB
    user = get_or_create_google_user(db, user_info)

    # 4️⃣ Trả kết quả
    return {
        "message": f"Đã đăng nhập thành công bằng Gmail với Gmail là: {user.email}",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }
