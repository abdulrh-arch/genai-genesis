from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers.email import router as email_router
from routers.history import router as history_router
from routers.auth import router as auth_router

app = FastAPI(title="Cold Email Orchestrator API")

# CORS — support comma-separated list or wildcard
_raw_origins = os.getenv("FRONTEND_URL", "http://localhost:3000")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init DB on startup
@app.on_event("startup")
def startup():
    try:
        init_db()
    except Exception as e:
        print(f"WARNING: Could not connect to database on startup: {e}")

# Routes
app.include_router(email_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(auth_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok"}
