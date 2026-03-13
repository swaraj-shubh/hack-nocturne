import time
import json
import base64
from fastapi import HTTPException
from webauthn import (
    generate_authentication_options,
    verify_authentication_response,
    options_to_json,
)
from webauthn.helpers.structs import PublicKeyCredentialDescriptor, UserVerificationRequirement
from src.db.main import users, credentials
from src.config import Config

CHALLENGE_TTL = 120  # seconds

def begin_webauthn_login(username: str):
    """
    Step 1 of WebAuthn Login.
    Generates a challenge for a user and returns authentication options,
    handling hex-encoded credential IDs from the database.
    """
    username = username.strip().lower()
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_creds = list(credentials.find({"username": username}))
    if not user_creds:
        raise HTTPException(status_code=404, detail="No WebAuthn credentials found for this user.")

    # Convert hex-encoded credential IDs from DB back to bytes for the library
    allow_credentials = [
        PublicKeyCredentialDescriptor(id=bytes.fromhex(c["credential_id"]))
        for c in user_creds
    ]

    options = generate_authentication_options(
        rp_id=Config.RP_ID,
        allow_credentials=allow_credentials,
        user_verification=UserVerificationRequirement.REQUIRED,
    )

    # Store the new challenge as a hex string for this login attempt
    users.update_one(
        {"username": username},
        {"$set": {
            "challenge": options.challenge.hex(),
            "challenge_ts": time.time()
        }}
    )

    return json.loads(options_to_json(options))


def complete_webauthn_login(username: str, authentication_response: dict):
    """
    Step 2 of WebAuthn Login.
    Verifies the client's signed challenge using hex-encoded stored data.
    """
    username = username.strip().lower()
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    challenge_hex = user.get("challenge")
    if not challenge_hex or time.time() - user.get("challenge_ts", 0) > CHALLENGE_TTL:
        raise HTTPException(status_code=400, detail="Challenge expired or invalid. Please try again.")

    # Convert stored hex challenge back to bytes for verification
    try:
        challenge_bytes = bytes.fromhex(challenge_hex)
    except (ValueError, TypeError):
        raise HTTPException(status_code=500, detail="Invalid stored challenge format.")

    # The browser sends the credential ID as a Base64URL string.
    # We need to convert it to a hex string to find it in our database.
    response_credential_id_b64url = authentication_response.get("id")
    if not response_credential_id_b64url:
        raise HTTPException(status_code=400, detail="Response is missing credential ID")
    
    try:
        response_credential_id_bytes = base64.urlsafe_b64decode(response_credential_id_b64url + "==")
        response_credential_id_hex = response_credential_id_bytes.hex()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid credential ID format from client")

    # Find the specific credential being used for this login
    stored_credential = credentials.find_one({
        "username": username,
        "credential_id": response_credential_id_hex
    })

    if not stored_credential:
        raise HTTPException(status_code=404, detail="This device is not registered for this user.")

    try:
        # Convert stored hex public key back to bytes for verification
        public_key_bytes = bytes.fromhex(stored_credential["public_key"])

        verification = verify_authentication_response(
            credential=authentication_response,
            expected_challenge=challenge_bytes,
            expected_origin=Config.FRONTEND_ORIGIN,
            expected_rp_id=Config.RP_ID,
            credential_public_key=public_key_bytes,
            credential_current_sign_count=stored_credential["sign_count"],
            require_user_verification=True,
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication verification failed: {str(e)}")

    # Update the signature counter
    credentials.update_one(
        {"_id": stored_credential["_id"]},
        {"$set": {"sign_count": verification.new_sign_count}}
    )

    # Clean up the used challenge
    users.update_one(
        {"username": username},
        {"$unset": {"challenge": "", "challenge_ts": ""}}
    )

    # Prepare a safe user object to return
    safe_user = {key: val for key, val in user.items() if key not in ["challenge", "challenge_ts", "password_hash"]}
    safe_user["_id"] = str(safe_user["_id"])

    return safe_user

