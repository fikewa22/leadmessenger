from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.message import Message
from app.models.contact import Contact
from app.schemas.message import MessageCreate, MessageResponse, MessagePreview
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["messages"])



@router.get("/", response_model=List[MessageResponse])
def get_messages(
    contact_id: Optional[str] = Query(None, description="Filter by contact ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    channel: Optional[str] = Query(None, description="Filter by channel"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all messages for the current user with optional filters"""
    query = db.query(Message).filter(Message.owner_id == current_user.id)
    
    if contact_id:
        query = query.filter(Message.contact_id == contact_id)
    if status:
        query = query.filter(Message.status == status)
    if channel:
        query = query.filter(Message.channel == channel)
    
    messages = query.order_by(Message.created_at.desc()).all()
    return messages

@router.get("/{message_id}", response_model=MessageResponse)
def get_message(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific message by ID"""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.owner_id == current_user.id
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return message

@router.post("/", response_model=MessageResponse)
def create_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new message"""
    # Verify contact exists and belongs to user
    contact = db.query(Contact).filter(
        Contact.id == message.contact_id,
        Contact.owner_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db_message = Message(
        owner_id=current_user.id,
        contact_id=message.contact_id,
        channel=message.channel,
        subject=message.subject,
        body=message.body,
        status="queued",
        scheduled_at=message.scheduled_at
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # TODO: Here you would integrate with email/SMS providers
    # For now, we'll simulate sending
    db_message.status = "sent"
    db_message.sent_at = datetime.utcnow()
    db.commit()
    db.refresh(db_message)
    
    return db_message

@router.post("/bulk", response_model=List[MessageResponse])
def create_bulk_messages(
    messages: List[MessageCreate],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create multiple messages at once"""
    created_messages = []
    
    for message_data in messages:
        # Verify contact exists and belongs to user
        contact = db.query(Contact).filter(
            Contact.id == message_data.contact_id,
            Contact.owner_id == current_user.id
        ).first()
        
        if not contact:
            raise HTTPException(status_code=404, detail=f"Contact {message_data.contact_id} not found")
        
        db_message = Message(
            owner_id=current_user.id,
            contact_id=message_data.contact_id,
            channel=message_data.channel,
            subject=message_data.subject,
            body=message_data.body,
            status="queued",
            scheduled_at=message_data.scheduled_at
        )
        
        db.add(db_message)
        created_messages.append(db_message)
    
    db.commit()
    
    # Simulate sending all messages
    for message in created_messages:
        message.status = "sent"
        message.sent_at = datetime.utcnow()
    
    db.commit()
    
    return created_messages

@router.get("/preview/{contact_id}", response_model=MessagePreview)
def get_message_preview(
    contact_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get message preview for a contact"""
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Get recent messages for this contact
    recent_messages = db.query(Message).filter(
        Message.contact_id == contact_id,
        Message.owner_id == current_user.id
    ).order_by(Message.created_at.desc()).limit(5).all()
    
    return MessagePreview(
        contact=contact,
        recent_messages=recent_messages
    )

@router.delete("/{message_id}")
def delete_message(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a message"""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.owner_id == current_user.id
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}
