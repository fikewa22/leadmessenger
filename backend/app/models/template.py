from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid

class Template(Base):
    __tablename__ = "template"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("app_user.id"), nullable=False)
    name = Column(String, nullable=False)
    subject = Column(String)
    body = Column(Text, nullable=False)
    channel = Column(String, nullable=False)  # email, sms, whatsapp
    category = Column(String)  # cold_outreach, follow_up, networking, thank_you, freelance
    variables = Column(String, default="[]")  # JSON string of available variables
    usage_count = Column(String, default="0")  # Number of times used
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="templates")
