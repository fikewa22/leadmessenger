from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid

class User(Base):
    __tablename__ = "app_user"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    contacts = relationship("Contact", back_populates="owner")
    templates = relationship("Template", back_populates="owner")
    tasks = relationship("Task", back_populates="owner")
    messages = relationship("Message", back_populates="owner")
