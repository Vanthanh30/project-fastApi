from pydantic import BaseModel, EmailStr
from typing import Optional

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str

class ForgotPasswordResponse(BaseModel):
    message: str
    email: str

class ResetPasswordResponse(BaseModel):
    message: str