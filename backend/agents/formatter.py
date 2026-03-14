import re


def format_signature(body: str, resume_text: str) -> str:
    """
    Ensures the email body has a clean signature extracted from the resume.
    Replaces any existing sign-off with a properly formatted one.
    """
    # Extract name from resume (first non-empty line is usually the name)
    name = ""
    for line in resume_text.split("\n"):
        line = line.strip()
        if line and len(line.split()) <= 4 and not any(c in line for c in ["@", "http", "|", "·"]):
            name = line
            break

    # Extract email from resume
    email_match = re.search(r"[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}", resume_text)
    email = email_match.group(0) if email_match else ""

    # Extract phone from resume
    phone_match = re.search(r"(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})", resume_text)
    phone = phone_match.group(0).strip() if phone_match else ""

    # Remove any existing sign-off patterns from the body
    signoff_patterns = [
        r"\n(Best regards?|Sincerely|Thanks?|Regards?|Cheers|Warm regards?)[,.]?\s*\n.*$",
        r"\n(Best|Yours truly)[,.]?\s*\n.*$",
    ]
    cleaned_body = body
    for pattern in signoff_patterns:
        cleaned_body = re.sub(pattern, "", cleaned_body, flags=re.IGNORECASE | re.DOTALL).strip()

    # Build signature (leading empty strings create blank lines)
    sig_lines = ["", "", "Best regards,", name or ""]
    if email:
        sig_lines.append(email)
    if phone:
        sig_lines.append(phone)

    return cleaned_body + "\n".join(sig_lines)
