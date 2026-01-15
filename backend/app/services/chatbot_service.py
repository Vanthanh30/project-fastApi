from sqlalchemy.orm import Session
from app.schemas.chatbot import ChatResponse
from app.services.intent_analyzer import analyze_message
from app.services.product_query import query_products
from app.services.response_generator import generate_response

def handle_chat(message: str, db: Session) -> ChatResponse:
    analysis = analyze_message(message)
    products = query_products(analysis, db)
    reply = generate_response(message, products)
    return ChatResponse(reply=reply)
