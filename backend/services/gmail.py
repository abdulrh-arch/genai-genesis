import os
import base64
import json
import secrets
import hashlib
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
TOKEN_FILE = "gmail_token.json"
VERIFIER_FILE = "oauth_verifier.txt"


def _check_oauth_config():
    if not os.getenv("GOOGLE_CLIENT_ID") or not os.getenv("GOOGLE_CLIENT_SECRET"):
        raise RuntimeError(
            "Gmail OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file."
        )


def get_oauth_flow() -> Flow:
    _check_oauth_config()
    client_config = {
        "web": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uris": [os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/gmail/callback")],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }
    return Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/gmail/callback"),
    )


def get_auth_url() -> str:
    flow = get_oauth_flow()
    # Generate PKCE code verifier and challenge
    code_verifier = secrets.token_urlsafe(64)
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).rstrip(b"=").decode()
    # Save verifier for use in callback
    with open(VERIFIER_FILE, "w") as f:
        f.write(code_verifier)
    auth_url, _ = flow.authorization_url(
        prompt="consent",
        access_type="offline",
        code_challenge=code_challenge,
        code_challenge_method="S256",
    )
    return auth_url


def exchange_code_for_token(code: str) -> dict:
    flow = get_oauth_flow()
    # Read saved PKCE verifier
    code_verifier = None
    if os.path.exists(VERIFIER_FILE):
        with open(VERIFIER_FILE) as f:
            code_verifier = f.read().strip()
        os.remove(VERIFIER_FILE)
    flow.fetch_token(code=code, code_verifier=code_verifier)
    creds = flow.credentials
    token_data = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": list(creds.scopes) if creds.scopes else [],
    }
    with open(TOKEN_FILE, "w") as f:
        json.dump(token_data, f)
    return token_data


def load_credentials() -> Credentials | None:
    if not os.path.exists(TOKEN_FILE):
        return None
    with open(TOKEN_FILE) as f:
        data = json.load(f)
    creds = Credentials(
        token=data["token"],
        refresh_token=data.get("refresh_token"),
        token_uri=data["token_uri"],
        client_id=data["client_id"],
        client_secret=data["client_secret"],
        scopes=data.get("scopes"),
    )
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        data["token"] = creds.token
        with open(TOKEN_FILE, "w") as f:
            json.dump(data, f)
    return creds


def is_gmail_connected() -> bool:
    return os.path.exists(TOKEN_FILE)


def send_email(to: str, subject: str, body: str) -> bool:
    """Send an email via Gmail API. Returns True on success."""
    creds = load_credentials()
    if not creds:
        raise RuntimeError("Gmail not connected. Complete OAuth first.")

    service = build("gmail", "v1", credentials=creds)

    message = MIMEText(body)
    message["to"] = to
    message["subject"] = subject

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    service.users().messages().send(userId="me", body={"raw": raw}).execute()
    return True
