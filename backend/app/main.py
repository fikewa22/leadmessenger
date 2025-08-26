from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, contacts, templates, tasks, messages, webhooks
from app.core.config import settings
from app.db.database import engine
from app.models import Base

# Create database tables (this will work with SQLite)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LeadMessenger API",
    description="Mobile-first outreach CRM API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(contacts.router, prefix="/api/v1")
app.include_router(templates.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(messages.router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "LeadMessenger API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
