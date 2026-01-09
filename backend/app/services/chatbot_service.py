from sqlalchemy import or_
from sqlalchemy.orm import Session
from openai import OpenAI

from app.models.product import Product
from app.schemas.chatbot import ChatResponse
from app.core.config import settings
from app.models.category import Category

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def handle_chat(message: str, db: Session) -> ChatResponse:
    msg = message.lower()

    categories = (
        db.query(Category)
        .filter(Category.status == 1)
        .all()
    )

    query = db.query(Product).join(Category)

    # 1️⃣ Match category phrase động
    matched_category = None
    for c in categories:
        if c.name.lower() in msg:
            matched_category = c
            break

    if matched_category:
        products = (
            query
            .filter(Product.category_id == matched_category.id)
            .limit(6)
            .all()
        )
    else:
        # 2️⃣ fallback keyword search
        keywords = msg.split()
        conditions = []
        for kw in keywords:
            if len(kw) < 3:
                continue
            like = f"%{kw}%"
            conditions.extend([
                Product.name.ilike(like),
                Product.brand.ilike(like),
                Product.description.ilike(like),
                Category.name.ilike(like),
            ])

        if conditions:
            query = query.filter(or_(*conditions))

        products = query.limit(6).all()

    if not products:
        return ChatResponse(
            reply="😊 Bạn có thể cho mình biết rõ hơn nhu cầu để mình tư vấn chính xác hơn nha!"
        )

    # 🔹 Chuẩn bị context
    product_context = "\n".join([
        f"- {p.name} | Giá: {int(p.price):,}đ | "
        f"Thương hiệu: {p.brand or 'Không rõ'} | "
        f"Mô tả: {p.description or 'Đang cập nhật'}"
        for p in products
    ])

    prompt = f"""
Bạn là chatbot tư vấn cho website bán mỹ phẩm.

Yêu cầu:
- Trả lời tự nhiên, thân thiện như nhân viên tư vấn
- Nếu khách hỏi chung chung → hỏi lại nhu cầu
- Nếu khách hỏi theo loại → gợi ý đúng sản phẩm
- KHÔNG bịa giá, KHÔNG bịa thông tin

CÂU HỎI KHÁCH:
"{message}"

DANH SÁCH SẢN PHẨM:
{product_context}

"""

    completion = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    return ChatResponse(
        reply=completion.output_text
    )
