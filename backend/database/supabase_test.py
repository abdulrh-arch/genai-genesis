from supabase import create_client

url = "https://inzeamqmrnrgnznkvvwl.supabase.co"
key = "sb_publishable_z8kkDpnZaT57Skob4DL24g_-86spYrB"

supabase = create_client(url, key)

TEST_EMAIL = "test_user@gmail.com"

# --- STEP 1: Get the ID of the existing user (if any) ---
existing_user = supabase.table("users").select("id").eq("email", TEST_EMAIL).execute()

if existing_user.data:
    old_id = existing_user.data[0]["id"]
    print(f"Cleaning up old data for ID: {old_id}")

    # Delete children first using the ID we just found
    supabase.table("applications").delete().eq("user_id", old_id).execute()
    supabase.table("resumes").delete().eq("user_id", old_id).execute()

    # Now safe to delete the user
    supabase.table("users").delete().eq("id", old_id).execute()

# --- STEP 2: Create User Fresh ---
mock_user = {"email": TEST_EMAIL, "name": "Test User"}
# Use upsert with on_conflict to ensure we get data back
response = supabase.table("users").upsert(mock_user, on_conflict="email").execute()

if not response.data:
    raise Exception("Failed to create user. Check RLS policies!")

user_id = response.data[0]["id"]
print(f"New User ID created: {user_id}")

# --- STEP 3: Insert Resume ---
resume_data = {
    "user_id": user_id,
    "resume_text": "CS student at UofT. Python/ML.",
    "file_url": "https://example.com/resume.pdf"
}
supabase.table("resumes").insert(resume_data).execute()

# --- STEP 4: Insert Job & Application ---
job = {
    "company": "Stripe",
    "role": "Software Engineer Intern",
    "job_description": "Backend/ML"
}
job_res = supabase.table("jobs").insert(job).execute()
job_id = job_res.data[0]["id"]

application = {
    "user_id": user_id,
    "job_id": job_id,
    "email_draft": "Hi Stripe...",
    "hallucination_score": 0.05
}

app_res = supabase.table("applications").insert(application).execute()
print("Success! Final Application Data:", app_res.data)
