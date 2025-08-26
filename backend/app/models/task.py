from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid
import enum

class TaskType(enum.Enum):
    follow_up = "follow_up"
    interview = "interview"
    application = "application"
    networking = "networking"
    research = "research"
    other = "other"

class TaskPriority(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskStatus(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class Task(Base):
    __tablename__ = "task"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("app_user.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    contact_id = Column(String, ForeignKey("contact.id"))
    type = Column(Enum(TaskType), nullable=False, default=TaskType.follow_up)
    priority = Column(Enum(TaskPriority), nullable=False, default=TaskPriority.medium)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.pending)
    due_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

    # Relationships
    owner = relationship("User", back_populates="tasks")
    contact = relationship("Contact", back_populates="tasks")
