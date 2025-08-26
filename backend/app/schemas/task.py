from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class TaskType(str, Enum):
    follow_up = "follow_up"
    interview = "interview"
    application = "application"
    networking = "networking"
    research = "research"
    other = "other"

class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    contact_id: Optional[str] = None
    type: TaskType = TaskType.follow_up
    priority: TaskPriority = TaskPriority.medium
    status: TaskStatus = TaskStatus.pending
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    contact_id: Optional[str] = None
    type: Optional[TaskType] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: str
    owner_id: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
