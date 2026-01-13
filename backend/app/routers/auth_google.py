from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.oauth import oauth
from app.db.base import get_db
from app.utils.auth_google import get_or_create_google_user
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/google")
async def login_google(request: Request):
    redirect_uri = "http://127.0.0.1:8000/auth/google/callback"

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
        token = await oauth.google.authorize_access_token(request)

        resp = await oauth.google.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            token=token
        )
        user_info = resp.json()

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    user = get_or_create_google_user(db, user_info)

    access_token = create_access_token(user_id=user.id, role="client")
    frontend_url = f"http://localhost:5173?access_token={access_token}"
    
    return RedirectResponse(url=frontend_url, status_code=303)
