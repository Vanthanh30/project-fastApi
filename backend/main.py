from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from app.db.base import engine
from app.models.base_model import Base
from app.routers.auth_google import router as auth_google_router
from app.routers.auth_facebook import router as auth_facebook_router
from app.core.config import settings
from app.routers.auth_user import router as auth_user_router
from app.routers.cart import router as cart_router 
import app.models.category
import app.models.product
from app.routers.order import router as order_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000", 
    ],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="session",
    https_only=False,  
    max_age=3600, 
    path="/",     
    same_site="lax" 
)


Base.metadata.create_all(bind=engine)

app.include_router(auth_google_router)
app.include_router(auth_facebook_router)
app.include_router(auth_user_router)
app.include_router(cart_router) 
app.include_router(order_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}