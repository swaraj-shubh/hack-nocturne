from pydantic import BaseModel,Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    username: str
    email: str
    kyberPublicKey: str
    dilithiumPublicKey: str


class UserModel(BaseModel):
    id: Optional[str]
    username: str
    invite_code: str
    kyber_public_key: str
    dilithium_public_key: str
    created_at: datetime
    is_active: bool

class UserLogin(BaseModel):
    username: str = Field(...)
    password: str = Field(...)
    
class RegistrationBeginBody(BaseModel):
    username: str
    email: str

class RegistrationCompleteBody(BaseModel):
    username: str
    registration_response: dict

class LoginBeginBody(BaseModel):
    username: str

class LoginCompleteBody(BaseModel):
    username: str
    authentication_response: dict

