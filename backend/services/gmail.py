import os
import base64
import json
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from database import SessionLocal, GmailToken

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

# In-memory fallback when DB is unavailable
_token_memory: dict | None = None


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
    auth_url, _ = flow.authorization_url(
        prompt="consent",
        access_type="offline",
    )
    return auth_url


def _save_token_to_db(token_data: dict):
    global _token_memory
    _token_memory = token_data  # Always save in memory
    try:
        db = SessionLocal()
        try:
            record = db.get(GmailToken, "default")
            if record:
                record.token_json = json.dumps(token_data)
            else:
                record = GmailToken(id="default", token_json=json.dumps(token_data))
                db.add(record)
            db.commit()
        finally:
            db.close()
    except Exception as e:
        print(f"WARNING: Could not save token to DB (using memory fallback): {e}")


def _load_token_from_db() -> dict | None:
    try:
        db = SessionLocal()
        try:
            record = db.get(GmailToken, "default")
            if record:
                return json.loads(record.token_json)
        finally:
            db.close()
    except Exception:
        pass
    return _token_memory  # Fall back to in-memory


def exchange_code_for_token(code: str) -> dict:
    flow = get_oauth_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials
    token_data = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": list(creds.scopes) if creds.scopes else [],
    }
    _save_token_to_db(token_data)
    return token_data


def load_credentials() -> Credentials | None:
    data = _load_token_from_db()
    if not data:
        return None
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
        _save_token_to_db(data)
    return creds


def is_gmail_connected() -> bool:
    try:
        return _load_token_from_db() is not None
    except Exception:
        return False


def send_email(to: str, subject: str, body: str) -> bool:
    """Send an email via Gmail API. Returns True on success."""
    creds = load_credentials()
    if not creds:
        raise RuntimeError("Gmail not connected. Complete OAuth first.")

    service = build("gmail", "v1", credentials=creds)

    message = MIMEText(body, "plain", "utf-8")
    message["to"] = to
    message["subject"] = subject

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    service.users().messages().send(userId="me", body={"raw": raw}).execute()
    return True
