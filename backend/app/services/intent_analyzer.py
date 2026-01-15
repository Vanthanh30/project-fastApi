import json
import re
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def analyze_message(message: str) -> dict:
    msg = message.lower()

    budget_match = re.search(r"(\d{2,7})", msg)
    if budget_match:
        return {
            "intent": "budget",
            "budget": int(budget_match.group(1)),
            "category": None,
            "keywords": []
        }

    CATEGORY_KEYWORDS = [
        "son", "sữa rửa mặt", "toner", "serum", "kem dưỡng", "chống nắng"
    ]
    for cat in CATEGORY_KEYWORDS:
        if cat in msg:
            return {
                "intent": "category",
                "budget": None,
                "category": cat,
                "keywords": []
            }

    words = [w for w in msg.split() if len(w) > 2]
    return {
        "intent": "general",
        "budget": None,
        "category": None,
        "keywords": words
    }
