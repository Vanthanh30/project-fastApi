from pydantic import BaseModel,EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    user_id: int
    exp: int
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
