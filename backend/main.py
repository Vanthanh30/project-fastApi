from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ← THÊM DÒNG NÀY
from app.db.base import get_db
from app.models.base_model import Base
from app.db.base import engine
from app.routers.auth import router as auth_router
from app.routers.admin import router as admin_router
from app.routers.category import router as category_router
from app.routers.product import router as product_router
from app.routers.chatbot import router as chatbot_router
import app.core.cloudinary_config
from app.utils.seed_admin import seed_admin

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

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(chatbot_router)
seed_admin()

@app.get("/")
async def root():
    return {"message": "Hello World"}