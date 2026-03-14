import os
from groq import Groq
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, EmailRecord
from services.pdf_parser import extract_text_from_pdf
from services.gmail import send_email, is_gmail_connected
from agents.job_analyzer import analyze_job
from agents.email_drafter import draft_email
from agents.formatter import format_signature

router = APIRouter()


def get_llm_client() -> Groq:
    return Groq(api_key=os.getenv("LLM_API_KEY"))


# ── Generate email ────────────────────────────────────────────────────────────

@router.post("/generate-email")
async def generate_email(
    job_description: str = Form(...),
    recipient_email: str = Form(...),
    tone: str = Form("professional"),
    resume: UploadFile = File(...),
):
    # 1. Parse resume
    resume_bytes = await resume.read()
    resume_text = extract_text_from_pdf(resume_bytes)
    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from resume PDF.")

    client = get_llm_client()

    # 2. Analyze job description
    job_info = analyze_job(job_description, client)

    # 3. Draft email
    draft = draft_email(job_info, resume_text, tone, client)

    # 4. Format signature
    final_body = format_signature(draft["body"], resume_text)

    return {
        "subject": draft["subject"],
        "body": final_body,
        "recipient_name": job_info.get("recruiter_name", ""),
    }


# ── Send email ────────────────────────────────────────────────────────────────

class SendEmailRequest(BaseModel):
    subject: str
    body: str
    recipient_email: str
    tone: str = "professional"


@router.post("/send-email")
async def send_email_endpoint(
    payload: SendEmailRequest,
    db: Session = Depends(get_db),
):
    if not is_gmail_connected():
        raise HTTPException(
            status_code=401,
            detail="Gmail not connected. Visit /api/auth/gmail to authorize.",
        )

    status = "sent"
    try:
        send_email(
            to=payload.recipient_email,
            subject=payload.subject,
            body=payload.body,
        )
    except Exception as e:
        status = "failed"
        record = EmailRecord(
            recipient_email=payload.recipient_email,
            subject=payload.subject,
            body=payload.body,
            tone=payload.tone,
            status=status,
        )
        db.add(record)
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

    record = EmailRecord(
        recipient_email=payload.recipient_email,
        subject=payload.subject,
        body=payload.body,
        tone=payload.tone,
        status=status,
    )
    db.add(record)
    db.commit()

    return {"status": "ok", "id": record.id}
