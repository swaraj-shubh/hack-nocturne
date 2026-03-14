from fastapi import APIRouter, Depends
import cloudinary
import cloudinary.utils
import time

import src.utils.cloudinary_config   # loads the config
from src.utils.auth import get_current_user

cloudinaryRouter = APIRouter()

@cloudinaryRouter.get("/cloudinary-signature")
def get_cloudinary_signature(current_user=Depends(get_current_user)):

    timestamp = int(time.time())

    signature = cloudinary.utils.api_sign_request(
        {"timestamp": timestamp},
        cloudinary.config().api_secret
    )

    return {
        "timestamp": timestamp,
        "signature": signature,
        "api_key": cloudinary.config().api_key,
        "cloud_name": cloudinary.config().cloud_name
    }