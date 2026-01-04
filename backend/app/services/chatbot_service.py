from sqlalchemy.orm import Session
from openai import OpenAI
from app.core.config import settings
from app.models.product import Product
from app.models.category import Category

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def handle_chat(message: str, db: Session):
    # 🔹 Lấy danh sách sản phẩm đang bán
    products = (
        db.query(Product)
        .join(Category, Product.category_id == Category.id)
        .filter(
            Product.status == 1,
            Product.deleted_at.is_(None)
        )
        .limit(6)
        .all()
    )

    # Nếu DB chưa có sản phẩm
    if not products:
        return {
            "reply": "😔 Hiện tại shop chưa có sản phẩm để tư vấn. Bạn quay lại sau nhé!",
            "products": []
        }

    # 🔹 Chuẩn bị dữ liệu sản phẩm cho AI
    product_context = "\n".join([
        f"- {p.name} | Loại: {p.category.name if p.category else 'Không rõ'} | "
        f"Giá: {p.price}đ | Thương hiệu: {p.brand or 'Không rõ'} | "
        f"Mô tả: {p.description or 'Đang cập nhật'}"
        for p in products
    ])

    # 🔥 PROMPT TMĐT – CHỈ TƯ VẤN SẢN PHẨM
    prompt = f"""
Bạn là nhân viên tư vấn sản phẩm cho website thương mại điện tử.

NGUYÊN TẮC:
- Trả lời thân thiện, tự nhiên, giống nhân viên bán hàng.
- KHÔNG bịa sản phẩm, giá, thương hiệu.
- CHỈ sử dụng thông tin sản phẩm được cung cấp.
- Nếu khách hỏi chung chung → hỏi lại để làm rõ.
- Nếu khách hỏi theo LOẠI → liệt kê các sản phẩm phù hợp.
- Nếu khách hỏi SẢN PHẨM CỤ THỂ → mô tả chi tiết sản phẩm đó.
- Không tư vấn đơn hàng, không nhắc đến thanh toán.

CÂU HỎI KHÁCH HÀNG:
"{message}"

DANH SÁCH SẢN PHẨM HIỆN CÓ:
{product_context}

YÊU CẦU TRẢ LỜI:
- Tiếng Việt
- Ngắn gọn, dễ hiểu
- Có thể hỏi thêm để tư vấn tốt hơn
"""

    completion = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=prompt
    )

    return {
        "reply": completion.output_text,
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "brand": p.brand,
                "category": p.category.name if p.category else None
            } for p in products
        ]
    }


