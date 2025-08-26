from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageBase(BaseModel):
    contact_id: str
    channel: str
    subject: Optional[str] = None
    body: str
    scheduled_at: Optional[datetime] = None

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: str
    owner_id: str
    provider_id: Optional[str] = None
    status: str
    sent_at: Optional[datetime] = None
    error: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class MessagePreview(BaseModel):
    contact: dict  # Contact information
    recent_messages: List[MessageResponse]
