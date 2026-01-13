from sqlalchemy import or_
from sqlalchemy.orm import Session
from openai import OpenAI

from app.models.product import Product
from app.schemas.chatbot import ChatResponse
from app.core.config import settings
from app.models.category import Category

client = OpenAI(api_key=settings.OPENAI_API_KEY)

STOP_WORDS = {
    "shop", "có", "không", "cho", "tôi", "mình", "bạn",
    "về", "các", "loại", "nào", "giúp", "tìm"
}
def handle_chat(message: str, db: Session) -> ChatResponse:
    msg = message.lower().strip()

    exact_products = (
        db.query(Product)
        .join(Category)
        .filter(
            Product.status == 1,
            Category.status == 1,
            Product.name.ilike(f"%{msg}%")
        )
        .limit(5)
        .all()
    )

    if exact_products:
        products = exact_products
    else:
        keywords = [
            w for w in msg.split()
            if w not in STOP_WORDS and len(w) > 1
        ]

        conditions = []
        for kw in keywords:
            like = f"%{kw}%"
            conditions.extend([
                Product.name.ilike(like),
                Product.brand.ilike(like),
                Product.description.ilike(like),
                Category.name.ilike(like),
            ])

        products = []
        if conditions:
            products = (
                db.query(Product)
                .join(Category)
                .filter(
                    Product.status == 1,
                    Category.status == 1,
                    or_(*conditions)
                )
                .distinct()
                .limit(10)
                .all()
            )


    if not products:
        return ChatResponse(
            reply="Bạn có thể cho mình biết rõ hơn nhu cầu để mình tư vấn chính xác hơn nha!"
        )

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
