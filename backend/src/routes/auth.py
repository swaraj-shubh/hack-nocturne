from fastapi import APIRouter, BackgroundTasks, Response, HTTPException,Request
from src.models.auth import (
    UserRegister,
    RegistrationBeginBody,
    RegistrationCompleteBody,
    LoginBeginBody,
    LoginCompleteBody,
)
from src.utils.auth import register_user,create_token
from src.utils.webauthn import begin_webauthn_registration, complete_webauthn_registration
from src.utils.login import begin_webauthn_login, complete_webauthn_login

authRouter = APIRouter()

@authRouter.post("/register-begin")
def register_begin(data: RegistrationBeginBody):
    return begin_webauthn_registration(data.username, data.email)

@authRouter.post("/register-complete")
def register_complete(data: RegistrationCompleteBody):
    return complete_webauthn_registration(data.username, data.registration_response)

@authRouter.post("/register")
def register(data: UserRegister, background_tasks: BackgroundTasks):
    return register_user(data, background_tasks)


@authRouter.post("/login-begin")
def login_begin(data: LoginBeginBody):
    """
    Step 1 of WebAuthn Login: Client provides username.
    Returns a unique challenge for the client's authenticator to sign.
    """
    # ✅ FIX: Removed `await` and `request` argument to match function signature.
    return begin_webauthn_login(data.username)

@authRouter.post("/login-complete")
def login_complete(data: LoginCompleteBody, response: Response):
    """
    Step 2 of WebAuthn Login: Client sends the signed challenge.
    If valid, a JWT session cookie is created and the user data is returned.
    """
    # ✅ FIX: Removed `await` and `request` argument.
    # The function now directly returns the verified user object upon success.
    verified_user = complete_webauthn_login(data.username, data.authentication_response)

    if verified_user:
        token = create_token({"sub": data.username})

        # Set a secure, HTTP-only cookie for session management
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True,  # IMPORTANT: Set to True in production with HTTPS
            samesite="strict",
            max_age=7 * 24 * 60 * 60,  # 7 days
            path="/"
        )

        return {"success": True, "msg": "Login successful", "user": verified_user}
    
    # This line will only be reached if the utility function doesn't raise an exception but fails.
    # The primary error handling is the HTTPException raised within `complete_webauthn_login`.
    raise HTTPException(status_code=401, detail="WebAuthn verification failed")

# --- LOGOUT ---

@authRouter.post("/logout")
def logout(response: Response):
    """Clears the session cookie to log the user out."""
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}

