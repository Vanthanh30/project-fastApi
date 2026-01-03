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
    role: str
    exp: int

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    role_id: int

    class Config:
        from_attributes = True
        