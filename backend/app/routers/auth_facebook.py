from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session

from app.core.oauth import oauth
from app.db.base import get_db
from app.utils.auth_facebook import get_or_create_facebook_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/facebook")
async def login_facebook(request: Request):
    redirect_uri = "http://localhost:8000/auth/facebook/callback"

    return await oauth.facebook.authorize_redirect(
        request,
        redirect_uri,
        auth_type="rerequest"
    )


@router.get("/facebook/callback")
async def facebook_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        token = await oauth.facebook.authorize_access_token(request)

        resp = await oauth.facebook.get(
            "me?fields=id,name,email",
            token=token
        )
        profile = resp.json()

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if "id" not in profile:
        raise HTTPException(
            status_code=400,
            detail="Không lấy được thông tin Facebook"
        )

    user = get_or_create_facebook_user(db, profile)

    return {
        "message": f"Đã đăng nhập thành công bằng Facebook với tên là: {user.name}",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }
