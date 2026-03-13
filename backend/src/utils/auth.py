from fastapi import HTTPException, Request, WebSocket, BackgroundTasks
from jose import jwt, JWTError
import os
import uuid
from datetime import datetime, timedelta, timezone
from src.models.auth import UserRegister  # Note: You will need to remove the 'password' field from this Pydantic model
from src.db.main import users
import re
from src.config import Config
import base64
from src.utils.email import welcome_email

# --- JWT Configuration and Exception Handling ---

credentials_exception = HTTPException(
    status_code=401,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

def create_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT token with the provided data."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Default expiration time for the token
        expire = datetime.now(timezone.utc) + timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode a JWT token and return its payload."""
    try:
        payload = jwt.decode(
            token,
            Config.SECRET_KEY,
            algorithms=[Config.ALGORITHM]
        )
        return payload
    except JWTError:
        raise credentials_exception

# --- Core User Functions (Passwordless) ---

def register_user(data: UserRegister, background_tasks: BackgroundTasks):
    """
    Handles registration of a new user in a passwordless system.
    It validates user data, stores public keys, and sends a welcome email.
    """

    # Normalize username and email
    username = (data.username or "").strip().lower()
    email = (data.email or "").strip().lower()

    # Validate required fields
    if not username or not email:
        raise HTTPException(status_code=400, detail="Username and email are required")

    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Find existing user record (could be temporary from register-begin)
    existing_user = users.find_one({"username": username})

    # Check if this is a fully registered user (has public keys)
    if existing_user and existing_user.get("kyber_public_key"):
        raise HTTPException(status_code=400, detail="Username already taken")

    # Check if email is already used by a different fully registered user
    email_owner = users.find_one({"email": email})
    if email_owner and email_owner.get("username") != username and email_owner.get("kyber_public_key"):
        raise HTTPException(status_code=400, detail="Email already registered")

    now = datetime.now(timezone.utc)
    invite_code = str(uuid.uuid4())[:8]

    try:
        # Decode public keys from base64
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
        "verified": True,   # final account state
    }

    if existing_user:
        # Update the temporary placeholder record created during register-begin
        users.update_one(
            {"_id": existing_user["_id"]},
            {
                "$set": user_doc,
                "$unset": {"challenge": "", "challenge_ts": "", "user_id": ""}
            }
        )
        saved_user = users.find_one({"_id": existing_user["_id"]})
    else:
        # This shouldn't happen in normal flow, but handle it gracefully
        # Check one more time that email isn't used
        other = users.find_one({"email": email})
        if other and other.get("kyber_public_key"):
            raise HTTPException(status_code=400, detail="Email already registered")

        users.insert_one(user_doc)
        saved_user = users.find_one({"username": username})

    # Prepare and send a welcome email in the background
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4A90E2;">Welcome to Our Secure Platform!</h1>
            <p>Hello <strong>{username}</strong>,</p>
            <p>Your account has been created successfully with quantum-safe encryption.</p>
            <p>Your invite code: <strong style="font-size: 18px; color: #4A90E2;">{invite_code}</strong></p>
            <p>Thank you for choosing security first!</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </body>
    </html>
    """
    subject = "Welcome to Our Secure Platform - Account Created Successfully"
    welcome_email([email], html, subject, background_tasks)

    return {
        "msg": "User registered successfully",
        "invite_code": invite_code
    }


# --- Current User Retrieval for Authenticated Routes ---

def get_current_user(request: Request):
    """
    Dependency to get the current user from a JWT in a cookie for standard HTTP requests.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        data = decode_token(token)
        user = users.find_one({"username": data["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        # Ensure password hash is not returned, even if present in old records
        user.pop("password_hash", None)
        user["id"] = str(user["_id"])
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user_ws(websocket: WebSocket):
    """
    Dependency to get the current user from a JWT in a cookie for WebSocket connections.
    """
    token = websocket.cookies.get("access_token")
    if not token:
        return None
    try:
        data = decode_token(token)
        user = users.find_one({"username": data["sub"]})
        if not user:
            return None
        # Ensure password hash is not returned
        user.pop("password_hash", None)
        user["id"] = str(user["_id"])
        return user
    except Exception:
        return None
