from sqlalchemy import Column, String, DateTime, ForeignKey, BigInteger, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Event(Base):
    __tablename__ = "event"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    message_id = Column(String, ForeignKey("message.id", ondelete="CASCADE"), nullable=True)
    kind = Column(String, nullable=False)  # open, click, reply, bounce, delivery
    meta = Column(Text, nullable=True)  # Store as JSON string for SQLite
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    message = relationship("Message", back_populates="events")
