from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from services.gmail import get_auth_url, exchange_code_for_token, is_gmail_connected
import os

router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


@router.get("/auth/gmail")
def gmail_auth():
    """Redirect user to Google OAuth consent screen."""
    try:
        url = get_auth_url()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    return RedirectResponse(url)


@router.get("/auth/gmail/callback")
def gmail_callback(code: str):
    """Handle OAuth callback, store token, redirect to frontend."""
    exchange_code_for_token(code)
    return RedirectResponse(f"{FRONTEND_URL}/dashboard?gmail=connected")


@router.get("/auth/gmail/status")
def gmail_status():
    configured = bool(os.getenv("GOOGLE_CLIENT_ID") and os.getenv("GOOGLE_CLIENT_SECRET"))
    return {"connected": is_gmail_connected(), "configured": configured}
