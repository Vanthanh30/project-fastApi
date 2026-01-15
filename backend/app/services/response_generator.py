from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_response(message: str, products: list) -> str:
    if not products:
        prompt = f"""
Bạn là chatbot tư vấn mỹ phẩm.

Khách hỏi:
"{message}"

Yêu cầu:
- Không nói shop không có sản phẩm
- Hỏi lại nhu cầu cụ thể
- Gợi ý thân thiện
"""
    else:
        product_context = "\n".join([
            f"- {p.name} | Giá: {int(p.price):,}đ | Thương hiệu: {p.brand or 'Không rõ'}"
            for p in products
        ])

        prompt = f"""
Bạn là chatbot tư vấn mỹ phẩm.

Khách hỏi:
"{message}"

Danh sách sản phẩm:
{product_context}

Yêu cầu:
- Liệt kê nhiều sản phẩm
- Không bịa giá
- Giữ giọng thân thiện
"""

    res = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    return res.output_text
