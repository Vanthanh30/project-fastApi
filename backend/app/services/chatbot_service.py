from sqlalchemy import or_
from sqlalchemy.orm import Session
from openai import OpenAI
from typing import List, Dict, Optional, Tuple
import re

from app.models.product import Product
from app.schemas.chatbot import EnhancedChatResponse
from app.core.config import settings
from app.models.category import Category

client = OpenAI(api_key=settings.OPENAI_API_KEY)


class KnowledgeBase:
    INGREDIENTS = {
        "vitamin c": {
            "benefits": ["Làm sáng da", "Chống oxy hóa", "Giảm thâm nám", "Tăng collagen"],
            "suitable_for": ["Da xỉn màu", "Da bị lão hóa", "Da có tàn nhang"],
            "caution": "Không dùng cùng AHA/BHA, tránh ánh nắng sau khi dùng",
            "concentration": "10-20%"
        },
        "hyaluronic acid": {
            "benefits": ["Cấp ẩm sâu", "Giữ nước", "Làm đầy da", "Giảm nếp nhăn"],
            "suitable_for": ["Da khô", "Da mất nước", "Da lão hóa"],
            "caution": "Cần khóa ẩm sau khi dùng",
            "concentration": "1-2%"
        },
        "niacinamide": {
            "benefits": ["Thu nhỏ lỗ chân lông", "Kiểm soát dầu", "Làm sáng da", "Giảm mụn"],
            "suitable_for": ["Da dầu", "Da mụn", "Da hỗn hợp"],
            "caution": "Có thể kết hợp với hầu hết thành phần",
            "concentration": "5-10%"
        },
        "retinol": {
            "benefits": ["Chống lão hóa", "Giảm nhăn", "Tăng tốc tái tạo da", "Trị mụn"],
            "suitable_for": ["Da lão hóa", "Da mụn", "Da xỉn màu"],
            "caution": "Chỉ dùng ban đêm, cần chống nắng, có thể gây kích ứng ban đầu",
            "concentration": "0.25-1%"
        },
        "aha": {
            "benefits": ["Tẩy tế bào chết", "Làm sáng da", "Mờ thâm", "Làm mịn da"],
            "suitable_for": ["Da khô", "Da xỉn màu", "Da có đốm nâu"],
            "caution": "Tăng độ nhạy cảm ánh nắng, cần chống nắng",
            "concentration": "5-10%"
        },
        "bha": {
            "benefits": ["Làm sạch lỗ chân lông", "Trị mụn", "Kiểm soát dầu", "Giảm viêm"],
            "suitable_for": ["Da dầu", "Da mụn", "Da hỗn hợp"],
            "caution": "Có thể gây khô da, nên dùng dần",
            "concentration": "1-2%"
        },
        "peptide": {
            "benefits": ["Tăng collagen", "Chống lão hóa", "Săn chắc da", "Phục hồi"],
            "suitable_for": ["Da lão hóa", "Da mất độ đàn hồi"],
            "caution": "An toàn, có thể dùng lâu dài",
            "concentration": "Không giới hạn"
        }
    }
    
    SKIN_TYPES = {
        "da dầu": {
            "characteristics": ["Tiết nhiều bã nhờn", "Lỗ chân lông to", "Hay bị mụn"],
            "recommended": ["Niacinamide", "BHA", "Tea Tree", "Zinc"],
            "avoid": ["Dầu khoáng nặng", "Silicone dày"]
        },
        "da khô": {
            "characteristics": ["Thiếu độ ẩm", "Bong tróc", "Khít lỗ chân lông"],
            "recommended": ["Hyaluronic Acid", "Ceramide", "Glycerin", "Squalane"],
            "avoid": ["Alcohol", "Xà phòng mạnh", "AHA/BHA nồng độ cao"]
        },
        "da nhạy cảm": {
            "characteristics": ["Dễ đỏ", "Ngứa rát", "Mỏng yếu"],
            "recommended": ["Centella", "Madecassoside", "Panthenol", "Allantoin"],
            "avoid": ["Fragrance", "Essential Oil", "Alcohol", "AHA/BHA nồng độ cao"]
        },
        "da mụn": {
            "characteristics": ["Hay bị mụn", "Viêm đỏ", "Thâm mụn"],
            "recommended": ["BHA", "Niacinamide", "Tea Tree", "Azelaic Acid"],
            "avoid": ["Dầu nặng", "Silicone bít lỗ chân lông"]
        },
        "da lão hóa": {
            "characteristics": ["Nhăn", "Chảy xệ", "Mất đàn hồi"],
            "recommended": ["Retinol", "Peptide", "Vitamin C", "Coenzyme Q10"],
            "avoid": ["Sản phẩm quá khô", "Không chống nắng"]
        }
    }
    
    BRANDS = {
        "cerave": {"origin": "Mỹ", "range": "affordable", "specialty": "Ceramide, da nhạy cảm"},
        "la roche-posay": {"origin": "Pháp", "range": "mid", "specialty": "Dược mỹ phẩm"},
        "the ordinary": {"origin": "Canada", "range": "affordable", "specialty": "Nồng độ cao, giá rẻ"},
        "innisfree": {"origin": "Hàn Quốc", "range": "affordable", "specialty": "Thành phần tự nhiên"},
        "skii": {"origin": "Nhật Bản", "range": "luxury", "specialty": "Pitera làm sáng da"}
    }
    
    CONCERN_MAP = {
        "mụn": ["bha", "niacinamide"],
        "thâm": ["vitamin c", "niacinamide", "aha"],
        "lão hóa": ["retinol", "peptide", "vitamin c"],
        "nhăn": ["retinol", "peptide"],
        "khô": ["hyaluronic acid"],
        "dầu": ["niacinamide", "bha"],
        "lỗ chân lông": ["niacinamide", "bha"],
        "sáng da": ["vitamin c", "niacinamide", "aha"],
        "xỉn màu": ["vitamin c", "aha"]
    }


class EnhancedChatbotService:
    def __init__(self, db: Session):
        self.db = db
        self.kb = KnowledgeBase()
        self._categories = None
    
    @property
    def categories(self) -> List[Category]:
        if not self._categories:
            self._categories = self.db.query(Category).filter(Category.status == 1).all()
        return self._categories
    
    def extract_intent(self, msg: str) -> Dict:
        msg = msg.lower()
        intent = {
            'type': 'general',
            'category': None,
            'keywords': [],
            'price_range': None,
            'skin_type': None,
            'concern': None,
            'brand': None,
            'ingredient': None
        }
        
        if any(w in msg for w in ['giá', 'bao nhiêu', 'đắt', 'rẻ']):
            intent['type'] = 'ask_price'
        elif any(w in msg for w in ['so sánh', 'khác gì', 'tốt hơn']):
            intent['type'] = 'compare'
        elif any(w in msg for w in ['tư vấn', 'nên mua', 'gợi ý', 'phù hợp']):
            intent['type'] = 'recommend'
        elif any(w in msg for w in ['thành phần', 'công dụng']):
            intent['type'] = 'ask_ingredient'
        else:
            intent['type'] = 'find_product'
        
        for skin_type in self.kb.SKIN_TYPES:
            if skin_type in msg:
                intent['skin_type'] = skin_type
                break
        
        for concern in self.kb.CONCERN_MAP:
            if concern in msg:
                intent['concern'] = concern
                break
        
        for brand in self.kb.BRANDS:
            if brand in msg:
                intent['brand'] = brand
                break
        
        for ingredient in self.kb.INGREDIENTS:
            if ingredient in msg or ingredient.replace(" ", "") in msg.replace(" ", ""):
                intent['ingredient'] = ingredient
                break
        
        for cat in self.categories:
            if re.search(r'\b' + re.escape(cat.name.lower()) + r'\b', msg):
                intent['category'] = cat
                break
        
        stopwords = {'của', 'cho', 'tôi', 'mình', 'em', 'anh', 'chị', 'và', 'hay', 
                     'có', 'không', 'được', 'thì', 'là', 'với', 'để', 'nên'}
        intent['keywords'] = [w for w in re.findall(r'\w+', msg) if len(w) >= 3 and w not in stopwords]
        
        price_patterns = [
            (r'dưới\s+(\d+)k', lambda m: (0, int(m.group(1)) * 1000)),
            (r'dưới\s+(\d+)', lambda m: (0, int(m.group(1)))),
            (r'từ\s+(\d+)k?\s*đến\s*(\d+)k?', lambda m: (int(m.group(1)) * 1000, int(m.group(2)) * 1000)),
        ]
        
        for pattern, handler in price_patterns:
            if match := re.search(pattern, msg):
                intent['price_range'] = handler(match)
                break
        
        return intent
    
    def build_knowledge_context(self, intent: Dict) -> str:
        parts = []
        
        if intent['skin_type']:
            info = self.kb.SKIN_TYPES[intent['skin_type']]
            parts.append(f"\n LOẠI DA ({intent['skin_type'].upper()}):")
            parts.append(f"- Đặc điểm: {', '.join(info['characteristics'])}")
            parts.append(f"- Nên dùng: {', '.join(info['recommended'])}")
            parts.append(f"- Tránh: {', '.join(info['avoid'])}")
        
        if intent['concern']:
            ingredients = self.kb.CONCERN_MAP[intent['concern']]
            parts.append(f"\n GIẢI PHÁP '{intent['concern'].upper()}':")
            parts.append(f"- Thành phần: {', '.join(ingredients)}")
        
        if intent['ingredient']:
            info = self.kb.INGREDIENTS[intent['ingredient']]
            parts.append(f"\n {intent['ingredient'].upper()}:")
            parts.append(f"- Công dụng: {', '.join(info['benefits'])}")
            parts.append(f"- Phù hợp: {', '.join(info['suitable_for'])}")
            parts.append(f"- Lưu ý: {info['caution']}")
            parts.append(f"- Nồng độ: {info['concentration']}")
        
        if intent['brand']:
            info = self.kb.BRANDS[intent['brand']]
            parts.append(f"\n {intent['brand'].upper()}:")
            parts.append(f"- Xuất xứ: {info['origin']} | Phân khúc: {info['range']}")
            parts.append(f"- Đặc trưng: {info['specialty']}")
        
        return "\n".join(parts)
    
    def search_products(self, intent: Dict) -> List[Product]:
        q = self.db.query(Product).join(Category).filter(Product.status == 1)
        
        if intent['category']:
            q = q.filter(Product.category_id == intent['category'].id)
        
        if intent['brand']:
            q = q.filter(Product.brand.ilike(f"%{intent['brand']}%"))
        
        if intent['price_range']:
            min_p, max_p = intent['price_range']
            q = q.filter(Product.price >= min_p, Product.price <= max_p)
        
        terms = intent['keywords'].copy()
        if intent['ingredient']:
            terms.append(intent['ingredient'])
        
        if terms:
            conditions = []
            for t in terms:
                like = f"%{t}%"
                conditions.extend([
                    Product.name.ilike(like),
                    Product.brand.ilike(like),
                    Product.description.ilike(like)
                ])
            if conditions:
                q = q.filter(or_(*conditions))
        
 
        limit = 8 if intent['type'] == 'compare' else 6
        return q.limit(limit).all()
    
    def generate_prompt(self, msg: str, products: List[Product], intent: Dict, context: str) -> str:
        product_list = "\n".join([
            f"🔹 [{p.id}] {p.name}\n"
            f"    {int(p.price):,}đ |  {p.brand or 'Không rõ'}\n"
            f"    {(p.description or 'Đang cập nhật')[:150]}...\n"
       
            for p in products
        ])
        
        instructions = {
            'ask_ingredient': "Giải thích công dụng, nồng độ, cách dùng thành phần",
            'recommend': "Tư vấn cá nhân hóa, gợi ý 2-3 sản phẩm PHÙ HỢP NHẤT với lý do",
            'compare': "So sánh chi tiết thành phần, phù hợp, giá trị, ưu/nhược điểm",
            'ask_price': "Tập trung vào giá, so sánh giá trị, gợi ý phù hợp ngân sách",
            'find_product': "Giới thiệu sản phẩm, highlight điểm nổi bật"
        }
        
        instruction = instructions.get(intent['type'], instructions['find_product'])
        
        return f"""Bạn là chuyên gia tư vấn mỹ phẩm chuyên nghiệp.

HƯỚNG DẪN: {instruction}

CÂU HỎI: "{msg}"
KIẾN THỨC:{context}

SẢN PHẨM:
{product_list}
Tư vấn chuyên nghiệp, cá nhân hóa:"""
    
    def handle_chat(self, message: str) -> EnhancedChatResponse:
        intent = self.extract_intent(message)
        knowledge = self.build_knowledge_context(intent)
        products = self.search_products(intent)
        
        if not products:
            if knowledge:
                reply = f"Hiện chưa có sản phẩm phù hợp, nhưng đây là thông tin hữu ích:\n{knowledge}\n\n"
                reply += " Tìm sản phẩm có các thành phần trên hoặc cho biết thêm ngân sách để tư vấn!"
                return EnhancedChatResponse(
                    reply=reply,
                    products=[],
                    knowledge_used=True,
                    suggestions=self._suggestions(intent)
                )
            
            reply = "Chưa tìm thấy sản phẩm phù hợp. Cho biết thêm:\n"
            reply += "• Loại da (dầu/khô/hỗn hợp/nhạy cảm)\n"
            reply += "• Vấn đề da (mụn/thâm/lão hóa)\n"
            reply += "• Ngân sách\n• Thương hiệu yêu thích\n"
            return EnhancedChatResponse(reply=reply, products=[], knowledge_used=False, suggestions=[])
        
        prompt = self.generate_prompt(message, products, intent, knowledge)
        
        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Bạn là chuyên gia mỹ phẩm."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            reply = completion.choices[0].message.content
        except:
            reply = "Dựa trên nhu cầu, đây là sản phẩm phù hợp:\n\n"
            if knowledge:
                reply += knowledge + "\n\n"
            for p in products[:3]:
                reply += f"🔹 {p.name}\n    {int(p.price):,}đ |  {p.brand or 'Chính hãng'}\n\n"
        
        return EnhancedChatResponse(
            reply=reply,
            products=[p.id for p in products],
            knowledge_used=bool(knowledge),
            suggestions=self._suggestions(intent)
        )
    
    def _suggestions(self, intent: Dict) -> List[str]:
        suggestions = []
        if not intent['skin_type']:
            suggestions.append("Loại da của bạn là gì?")
        if not intent['price_range']:
            suggestions.append("Ngân sách khoảng bao nhiêu?")
        if intent['type'] == 'find_product' and not intent['concern']:
            suggestions.append("Muốn giải quyết vấn đề gì?")
        return suggestions[:2]


def handle_chat(message: str, db: Session) -> EnhancedChatResponse:
    service = EnhancedChatbotService(db)
    return service.handle_chat(message)