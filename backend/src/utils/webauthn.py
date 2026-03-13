import time
import uuid
import json
from fastapi import HTTPException
from webauthn.helpers.structs import (
    UserVerificationRequirement,
    AuthenticatorSelectionCriteria,
    ResidentKeyRequirement,
)
from webauthn import (
    generate_registration_options,
    verify_registration_response,
    options_to_json,
)
from src.db.main import users, credentials
from src.config import Config

CHALLENGE_TTL = 120  # seconds

def begin_webauthn_registration(username: str, email: str):
    username = username.strip().lower()
    email = email.strip().lower()
    if not username or not email:
        raise HTTPException(status_code=400, detail="Username and email are required")

    existing = users.find_one({"username": username})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user_id = str(uuid.uuid4())

    options = generate_registration_options(
        rp_id=Config.RP_ID,
        rp_name=Config.RP_NAME,
        user_id=user_id.encode(),
        user_name=username,
        user_display_name=username,
        authenticator_selection=AuthenticatorSelectionCriteria(
            resident_key=ResidentKeyRequirement.PREFERRED,
            user_verification=UserVerificationRequirement.REQUIRED,
        ),
    )

    users.insert_one({
        "username": username,
        "email": email,
        "user_id": user_id,
        "challenge": options.challenge.hex(),
        "challenge_ts": time.time(),
        "verified": False,
    })

    return json.loads(options_to_json(options))


def complete_webauthn_registration(username: str, registration_response: dict):
    username = username.strip().lower()
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    challenge_hex = user.get("challenge")
    if not challenge_hex or time.time() - user.get("challenge_ts", 0) > CHALLENGE_TTL:
        raise HTTPException(status_code=400, detail="Challenge expired. Please try registering again.")

    try:
        # Convert the hex string from the DB back to bytes for verification
        challenge_bytes = bytes.fromhex(challenge_hex)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid stored challenge format.")

    try:
        verification = verify_registration_response(
            credential=registration_response,
            expected_challenge=challenge_bytes, # Pass the correct `bytes` type
            expected_origin=Config.FRONTEND_ORIGIN,
            expected_rp_id=Config.RP_ID,
            require_user_verification=True,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Verification failed: {str(e)}")

    # Save the new credential to its own collection, storing binary data as hex strings
    credentials.insert_one({
        "username": username,
        "credential_id": verification.credential_id.hex(), # Store as hex string
        "public_key": verification.credential_public_key.hex(), # Store as hex string
        "sign_count": verification.sign_count,
        "transports": getattr(verification, "transports", []),
    })

    # Finalize the user document: mark as verified and remove the temporary challenge
    users.update_one(
        {"username": username},
        {
            "$set": {"verified": True, "updated_at": time.time()},
            "$unset": {"challenge": "", "challenge_ts": ""}
        },
    )
    
    # Here you would typically call your final user creation logic, 
    # like sending a welcome email. This is an example placeholder.
    # from src.utils.auth import register_user
    # register_user(user, background_tasks)

    return {"verified": True}

