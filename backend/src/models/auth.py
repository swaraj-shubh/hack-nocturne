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

    authentication_response: dict

