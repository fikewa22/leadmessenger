from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Supabase Database
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    DATABASE_URL: str = "postgresql://postgres:CWuWzc2GFdCcsMIS@db.lrcfghhytbnpvhysokui.supabase.co:5432/postgres"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis (optional for development)
    REDIS_URL: Optional[str] = None
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8081",  # Expo dev server
        "exp://localhost:8081",
        "http://localhost:19006",  # Expo web
        "http://192.168.1.108:8081",  # Your computer's IP
        "exp://192.168.1.108:8081",
        "*",  # Allow all origins temporarily for testing
    ]
    
    # Email providers
    RESEND_API_KEY: str = ""
    SENDGRID_API_KEY: str = ""
    
    # SMS/WhatsApp providers
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    
    # App settings
    MAX_CONTACTS_PER_USER: int = 10000
    MAX_MESSAGES_PER_HOUR: int = 200
    MAX_TASKS_PER_USER: int = 1000
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = "../.env"  # Load from project root
        env_file_encoding = "utf-8"

settings = Settings()
