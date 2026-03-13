from fastapi import HTTPException, Request, WebSocket, BackgroundTasks
from jose import jwt, JWTError
import uuid
from datetime import datetime, timedelta, timezone
from src.models.auth import UserRegister
from src.db.main import users
import re
from src.config import Config
import base64

# =============================
# JWT Configuration
# =============================

credentials_exception = HTTPException(
    status_code=401,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def create_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT token."""
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta
        if expires_delta
        else timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode a JWT token."""
    try:
        payload = jwt.decode(
            token,
            Config.SECRET_KEY,
            algorithms=[Config.ALGORITHM],
        )
        return payload
    except JWTError:
        raise credentials_exception


# =============================
# User Registration (Passwordless)
# =============================

def register_user(data: UserRegister, background_tasks: BackgroundTasks):

    username = (data.username or "").strip().lower()
    email = (data.email or "").strip().lower()

    if not username or not email:
        raise HTTPException(status_code=400, detail="Username and email are required")

    # Email validation
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_pattern, email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Check username
    existing_user = users.find_one({"username": username})
    if existing_user and existing_user.get("kyber_public_key"):
        raise HTTPException(status_code=400, detail="Username already taken")

    # Check email
    email_owner = users.find_one({"email": email})
    if email_owner and email_owner.get("username") != username and email_owner.get("kyber_public_key"):
        raise HTTPException(status_code=400, detail="Email already registered")

    now = datetime.now(timezone.utc)
    invite_code = str(uuid.uuid4())[:8]

    # Decode PQC public keys
    try:
        kyber_public_key = base64.b64decode(data.kyberPublicKey)
        dilithium_public_key = base64.b64decode(data.dilithiumPublicKey)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid public key encoding")

    user_doc = {
        "username": username,
        "email": email,
        "kyber_public_key": kyber_public_key.hex(),
        "dilithium_public_key": dilithium_public_key.hex(),
        "created_at": now,
        "updated_at": now,
        "invite_code": invite_code,
        "is_active": True,
        "verified": True,
    }

    if existing_user:
        users.update_one(
            {"_id": existing_user["_id"]},
            {
                "$set": user_doc,
                "$unset": {"challenge": "", "challenge_ts": "", "user_id": ""},
            },
        )
    else:
        users.insert_one(user_doc)

    return {
        "msg": "User registered successfully",
        "invite_code": invite_code,
    }


# =============================
# Current User (HTTP)
# =============================

def get_current_user(request: Request):

    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        data = decode_token(token)

        user = users.find_one({"username": data["sub"]})

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        user.pop("password_hash", None)
        user["id"] = str(user["_id"])

        return user

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# =============================
# Current User (WebSocket)
# =============================

async def get_current_user_ws(websocket: WebSocket):

    token = websocket.cookies.get("access_token")

    if not token:
        return None

    try:
        data = decode_token(token)

        user = users.find_one({"username": data["sub"]})

        if not user:
            return None

        user.pop("password_hash", None)
        user["id"] = str(user["_id"])

        return user

    except Exception:
        return None