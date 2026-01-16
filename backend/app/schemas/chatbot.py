from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal


class ChatRequest(BaseModel):
    message: str = Field(..., description="Tin nhắn từ khách hàng")
    session_id: Optional[str] = Field(None, description="ID phiên chat để theo dõi ngữ cảnh")


class ChatResponse(BaseModel):
    reply: str = Field(..., description="Câu trả lời từ chatbot")


class EnhancedChatResponse(BaseModel):
    """Response nâng cao với metadata"""
    reply: str = Field(..., description="Câu trả lời chi tiết từ chatbot")
    products: List[int] = Field(default=[], description="Danh sách ID sản phẩm được đề xuất")
    knowledge_used: bool = Field(default=False, description="Có sử dụng knowledge base hay không")
    suggestions: List[str] = Field(default=[], description="Gợi ý câu hỏi tiếp theo")
    intent_detected: Optional[dict] = Field(None, description="Intent được phát hiện (for debugging)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "reply": "Với da dầu mụn, mình gợi ý bạn 2 sản phẩm này...",
                "products": [1, 5, 12],
                "knowledge_used": True,
                "suggestions": ["Ngân sách của bạn khoảng bao nhiêu?"],
                "intent_detected": {
                    "type": "recommend",
                    "skin_type": "da dầu",
                    "skin_concern": "mụn"
                }
            }
        }


class ProductDetailResponse(BaseModel):
    """Response chi tiết về sản phẩm"""
    id: int
    name: str
    price: Decimal
    brand: Optional[str]
    description: Optional[str]
    category: str
    stock_quantity: int
    
    # Thông tin mở rộng
    key_ingredients: Optional[List[str]] = Field(None, description="Thành phần chính")
    suitable_for: Optional[List[str]] = Field(None, description="Phù hợp với loại da")
    benefits: Optional[List[str]] = Field(None, description="Lợi ích chính")
    

class ConversationContext(BaseModel):
    """Model lưu ngữ cảnh hội thoại"""
    session_id: str
    user_skin_type: Optional[str] = None
    user_concerns: List[str] = Field(default=[])
    budget_range: Optional[tuple] = None
    preferred_brands: List[str] = Field(default=[])
    viewed_products: List[int] = Field(default=[])
    conversation_history: List[dict] = Field(default=[])