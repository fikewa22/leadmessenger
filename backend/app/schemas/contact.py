from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class ContactBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    company: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    tags: Optional[List[str]] = []
    status: Optional[str] = "prospect"
    source: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    source: Optional[str] = None

class ContactResponse(ContactBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ContactList(BaseModel):
    contacts: List[ContactResponse]
    total: int
    page: int
    per_page: int
