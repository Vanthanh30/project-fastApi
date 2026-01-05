from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class ChatRequest(BaseModel):
    message: str
class ChatResponse(BaseModel):
    reply: str
