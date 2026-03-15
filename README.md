# cold-email-agent

Cold Email Agent

A multi-agent system built strictly for job hunters. Unlike standard LLM wrappers, the Cold Email Agent ensures that every outreach is factually grounded in the user's real portfolio and the recruiter's specific company context using job description and their resume. 

How-to-use:
1. Connect your Google account and decide which account to send the email from. 
2. Copy and paste the full job description of the position you are applying for into the text box.
3. Provide the recruiter's email and their LinkedIn URL.
4. Choose which tone to generate the email in (Professional, Friendly, Concise).
5. Drop your resume into the dropbox or upload it from your computer in a PDF format.
6. Click "Generate Cold Email" button. 
7. The agent researches the company and drafts a highly personalized, compelling cold email.
8. You can review the draft and regenerate if you want to change the wording. 
9. Click to send the email.

Tech Stack: 
Frontend: Next.js/TypeScript
Backend: Python (Fast API)
Database: Supabase (Postgres)
APIs: Claude, Gmail 

Prerequisites:
- Google Cloud Project with Gmail API enabled and OAuth2 credentials
- Anthropic API Key
- Supabase account 

Installation Steps:
1. Clone the repository
2. Configure environment variables:
  - DATABASE_URL
  - LLM_API_KEY
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
3. Run main.py
