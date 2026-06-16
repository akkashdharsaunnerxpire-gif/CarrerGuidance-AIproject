from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.database import Base, engine
from app.auth import router as auth_router
from app.career import router as career_router
from app.review import router as review_router
from app.adminroutes import router as Admin_Router
from app import models

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Career Guidance System")

FRONTEND_URL = os.getenv("FRONTEND_URL")

allow_origins=[
    FRONTEND_URL,
    "http://localhost:5173",
    "capacitor://localhost",
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(career_router)
app.include_router(review_router)
app.include_router(Admin_Router)