from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse, ContactList
import csv
import io

router = APIRouter(prefix="/contacts", tags=["contacts"])



@router.get("", response_model=ContactList)
def get_contacts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    tag: Optional[str] = None,
    q: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Contact).filter(Contact.owner_id == current_user.id)
    
    if tag:
        query = query.filter(Contact.tags.contains([tag]))
    
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            (Contact.first_name.ilike(search_term)) |
            (Contact.last_name.ilike(search_term)) |
            (Contact.company.ilike(search_term)) |
            (Contact.email.ilike(search_term))
        )
    
    total = query.count()
    contacts = query.offset((page - 1) * per_page).limit(per_page).all()
    
    return ContactList(
        contacts=contacts,
        total=total,
        page=page,
        per_page=per_page
    )



@router.post("", response_model=ContactResponse)
def create_contact(
    contact_data: ContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check contact limits
    contact_count = db.query(Contact).filter(Contact.owner_id == current_user.id).count()
    if contact_count >= 10000:  # You can make this configurable
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact limit reached"
        )
    
    db_contact = Contact(owner_id=current_user.id, **contact_data.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    return contact

@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: str,
    contact_data: ContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    update_data = contact_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contact, field, value)
    
    db.commit()
    db.refresh(contact)
    return contact



@router.delete("/{contact_id}")
def delete_contact(
    contact_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted"}

@router.post("/import", response_model=List[ContactResponse])
async def import_contacts(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Import contacts from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        # Read CSV content
        content = await file.read()
        csv_text = content.decode('utf-8')
        
        # Parse CSV
        import csv
        from io import StringIO
        
        contacts = []
        csv_reader = csv.DictReader(StringIO(csv_text))
        
        for row in csv_reader:
            # Create contact object
            contact_data = {
                "email": row.get('email'),
                "first_name": row.get('first_name', ''),
                "last_name": row.get('last_name', ''),
                "company": row.get('company'),
                "position": row.get('position'),
                "phone": row.get('phone'),
                "linkedin": row.get('linkedin'),
                "tags": row.get('tags', '[]'),
                "status": row.get('status', 'prospect'),
                "source": row.get('source')
            }
            
            # Validate required fields
            if not contact_data["email"]:
                continue  # Skip rows without email
                
            # Create contact in database
            contact = Contact(
                owner_id=current_user.id,
                email=contact_data["email"],
                first_name=contact_data["first_name"],
                last_name=contact_data["last_name"],
                company=contact_data["company"],
                position=contact_data["position"],
                phone=contact_data["phone"],
                linkedin=contact_data["linkedin"],
                tags=contact_data["tags"],
                status=contact_data["status"],
                source=contact_data["source"]
            )
            
            db.add(contact)
            contacts.append(contact)
        
        db.commit()
        
        # Refresh contacts to get IDs
        for contact in contacts:
            db.refresh(contact)
        
        return contacts
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error importing contacts: {str(e)}")
