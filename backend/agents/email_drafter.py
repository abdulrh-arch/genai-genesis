import anthropic
import os


TONE_INSTRUCTIONS = {
    "professional": "formal and professional, using clear business language",
    "friendly": "warm and personable while still being professional",
    "concise": "brief and to the point — no fluff, under 150 words",
}


def draft_email(
    job_info: dict,
    resume_text: str,
    tone: str,
    client: anthropic.Anthropic,
) -> dict:
    """
    Draft a personalized cold email.
    Returns: { subject, body }
    """
    tone_desc = TONE_INSTRUCTIONS.get(tone, TONE_INSTRUCTIONS["professional"])
    requirements = ", ".join(job_info.get("requirements", []))

    response = client.messages.create(
        model=os.getenv("LLM_MODEL", "claude-opus-4-6"),
        max_tokens=1024,
        system="""You are an expert cold email writer for tech internship hunters.
Rules you MUST follow:
- Only use skills, projects, and experience from the provided resume
- Never invent credentials, projects, or claims not in the resume
- Never use generic AI phrases like "I hope this finds you well", "I am writing to express", "passion for technology"
- Never reference attachments unless the resume explicitly mentions them
- Write naturally, like a real human
- Keep it under 200 words""",
        messages=[
            {
                "role": "user",
                "content": f"""Write a cold email for a tech internship application.

Job Info:
- Company: {job_info.get('company', 'the company')}
- Role: {job_info.get('role', 'the position')}
- Key requirements: {requirements}

My Resume:
{resume_text}

Tone: {tone_desc}

Return ONLY the email with this exact format:
SUBJECT: <subject line>
BODY:
<email body>""",
            }
        ],
    )

    text = response.content[0].text.strip()

    # Parse subject and body
    subject = ""
    body = ""

    lines = text.split("\n")
    body_start = False
    body_lines = []

    for line in lines:
        if line.upper().startswith("SUBJECT:"):
            subject = line.split(":", 1)[1].strip()
        elif line.upper().startswith("BODY:"):
            body_start = True
        elif body_start:
            body_lines.append(line)

    body = "\n".join(body_lines).strip()

    # Fallback if parsing fails
    if not subject or not body:
        subject = f"Internship Application — {job_info.get('role', 'Software Engineering')}"
        body = text

    return {"subject": subject, "body": body}
