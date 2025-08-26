from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class TemplateCreate(BaseModel):
    name: str
    channel: str  # email, sms, whatsapp
    subject: Optional[str] = None  # email only
    body: str

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    channel: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None

class TemplateResponse(BaseModel):
    id: UUID
    name: str
    channel: str
    subject: Optional[str] = None
    body: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
