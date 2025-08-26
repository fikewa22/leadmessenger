from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid

class Message(Base):
    __tablename__ = "message"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("app_user.id", ondelete="CASCADE"), nullable=False, index=True)
    contact_id = Column(String, ForeignKey("contact.id", ondelete="CASCADE"), nullable=False, index=True)
    channel = Column(String, nullable=False)  # email, sms, whatsapp
    subject = Column(String, nullable=True)  # email only
    body = Column(Text, nullable=False)
    provider_id = Column(String, nullable=True)  # message id from provider
    status = Column(String, nullable=False, default="queued")  # queued, sent, delivered, bounced, failed, replied
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="messages")
    contact = relationship("Contact", back_populates="messages")
    events = relationship("Event", back_populates="message")
