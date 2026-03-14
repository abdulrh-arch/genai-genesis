from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, EmailRecord

router = APIRouter()


@router.get("/emails")
def get_emails(db: Session = Depends(get_db)):
    records = db.query(EmailRecord).order_by(EmailRecord.sent_at.desc()).all()
    return {
        "emails": [
            {
                "id": r.id,
                "recipient_email": r.recipient_email,
                "recipient_name": r.recipient_name,
                "subject": r.subject,
                "body": r.body,
                "tone": r.tone,
                "sent_at": r.sent_at.isoformat(),
                "status": r.status,
            }
            for r in records
        ]
    }
