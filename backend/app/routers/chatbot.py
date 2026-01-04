from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.services.chatbot_service import handle_chat
from app.schemas.chatbot import ChatRequest, ChatResponse

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    return handle_chat(payload.message, db)
