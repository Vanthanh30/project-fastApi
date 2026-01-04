import json
from app.core.config import settings
from app.core.openai_client import client

SYSTEM_PROMPT = """
Bạn là trợ lý bán hàng cho website.

Nhiệm vụ: trích xuất intent để backend truy vấn DB.
KHÔNG được bịa giá, ID hoặc tên sản phẩm không có trong câu.

QUY TẮC RẤT QUAN TRỌNG:
- keyword: ƯU TIÊN tên thương hiệu hoặc từ khóa đặc trưng.
- TUYỆT ĐỐI KHÔNG dùng các từ chung chung như:
  "tư vấn", "sản phẩm", "mua", "cần", "xem", "giá"
- Nếu không có keyword phù hợp → keyword = null

- category: loại sản phẩm nếu nhận ra (ví dụ: son, tẩy trang, cushion)
- price_type:
  - cheap: rẻ / giá thấp
  - expensive: cao / đắt
  - normal: bình thường
  - none: không đề cập
- max_price: nếu user nói "dưới 200k" thì max_price=200000

TRẢ VỀ JSON DUY NHẤT theo format:
{
  "keyword": string|null,
  "category": string|null,
  "price_type": "cheap"|"expensive"|"normal"|"none",
  "max_price": number|null
}
""".strip()


def extract_intent(message: str) -> dict:
    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ],
        temperature=0,
    )

    content = (resp.choices[0].message.content or "").strip()

    try:
        data = json.loads(content)
    except Exception:
        data = {
            "keyword": None,
            "category": None,
            "price_type": "none",
            "max_price": None,
        }

    # Normalize
    data.setdefault("keyword", None)
    data.setdefault("category", None)
    data.setdefault("price_type", "none")
    data.setdefault("max_price", None)

    if data["price_type"] not in ("cheap", "expensive", "normal", "none"):
        data["price_type"] = "none"

    return data
