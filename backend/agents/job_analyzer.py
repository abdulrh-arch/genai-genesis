import anthropic
import json
import os


def analyze_job(job_description: str, client: anthropic.Anthropic) -> dict:
    """
    Extract structured info from a job description.
    Returns: { company, role, requirements, recruiter_name }
    """
    response = client.messages.create(
        model=os.getenv("LLM_MODEL", "claude-opus-4-6"),
        max_tokens=512,
        messages=[
            {
                "role": "user",
                "content": f"""Extract key information from this job description.
Return ONLY valid JSON with these fields:
- company: company name (string)
- role: job title (string)
- requirements: top 3-5 key skills or requirements (array of strings)
- recruiter_name: recruiter or hiring manager name if mentioned, else empty string

Job Description:
{job_description}

JSON:""",
            }
        ],
    )

    text = response.content[0].text.strip()
    # Strip markdown code fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "company": "the company",
            "role": "the position",
            "requirements": [],
            "recruiter_name": "",
        }
