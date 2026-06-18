from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.database import Base, engine
from app.auth import router as auth_router
from app.career import router as career_router
from app.review import router as review_router
from app.adminroutes import router as Admin_Router
from app import models

# Load environment variables
load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="AI Career Guidance System")

# Environment variable
FRONTEND_URL = os.getenv("FRONTEND_URL")

print("===================================")
print("FRONTEND_URL =", FRONTEND_URL)
print("===================================")

# Allowed origins
allowed_origins = [
  "https://carrerguidance-aiproject.onrender.com",
  "https://localhost",
];

if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

print("ALLOWED ORIGINS =", allowed_origins)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Debug endpoint
@app.get("/")
async def home(request: Request):
    print("===== REQUEST RECEIVED =====")
    print("HOST:", request.headers.get("host"))
    print("ORIGIN:", request.headers.get("origin"))
    print("USER-AGENT:", request.headers.get("user-agent"))
    print("============================")

    return {
        "status": "Backend Running",
        "host": request.headers.get("host"),
        "origin": request.headers.get("origin"),
        "user_agent": request.headers.get("user-agent"),
        "allowed_origins": allowed_origins
    }

# Routers
app.include_router(auth_router)
app.include_router(career_router)
app.include_router(review_router)
app.include_router(Admin_Router)