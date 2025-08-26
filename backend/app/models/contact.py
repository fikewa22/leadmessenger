from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid

class Contact(Base):
    __tablename__ = "contact"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("app_user.id"), nullable=False)
    email = Column(String, nullable=False, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    company = Column(String)
    position = Column(String)  # Job title/position
    phone = Column(String)
    linkedin = Column(String)  # LinkedIn profile URL
    tags = Column(String, default="[]")  # JSON string of tags
    status = Column(String, default="prospect")  # prospect, contacted, responded, interviewed, hired
    source = Column(String)  # How you found this contact (LinkedIn, referral, etc.)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="contacts")
    messages = relationship("Message", back_populates="contact")
    tasks = relationship("Task", back_populates="contact")
