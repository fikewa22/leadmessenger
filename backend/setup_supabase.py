#!/usr/bin/env python3
"""
Setup script for Supabase database tables
Run this script to create all necessary tables in your Supabase database
"""

import os
import sys
from sqlalchemy import create_engine, text
from app.core.config import settings

def create_tables():
    """Create all database tables"""
    
    if not settings.DATABASE_URL:
        print("❌ DATABASE_URL not set. Please check your .env file.")
        return False
    
    try:
        # Create engine
        engine = create_engine(settings.DATABASE_URL)
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            print(f"✅ Connected to database: {result.fetchone()[0]}")
        
        # Create tables using raw SQL to avoid relationship issues
        create_tables_sql = """
        -- Users table
        CREATE TABLE IF NOT EXISTS app_user (
            id VARCHAR PRIMARY KEY,
            email VARCHAR UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Contacts table
        CREATE TABLE IF NOT EXISTS contact (
            id VARCHAR PRIMARY KEY,
            owner_id VARCHAR NOT NULL REFERENCES app_user(id),
            email VARCHAR NOT NULL,
            first_name VARCHAR NOT NULL,
            last_name VARCHAR NOT NULL,
            company VARCHAR,
            position VARCHAR,
            phone VARCHAR,
            linkedin VARCHAR,
            tags VARCHAR DEFAULT '[]',
            status VARCHAR DEFAULT 'prospect',
            source VARCHAR,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Templates table
        CREATE TABLE IF NOT EXISTS template (
            id VARCHAR PRIMARY KEY,
            owner_id VARCHAR NOT NULL REFERENCES app_user(id),
            name VARCHAR NOT NULL,
            subject VARCHAR,
            body TEXT NOT NULL,
            channel VARCHAR NOT NULL,
            category VARCHAR,
            variables VARCHAR DEFAULT '[]',
            usage_count VARCHAR DEFAULT '0',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tasks table
        CREATE TABLE IF NOT EXISTS task (
            id VARCHAR PRIMARY KEY,
            owner_id VARCHAR NOT NULL REFERENCES app_user(id),
            title VARCHAR NOT NULL,
            description TEXT,
            contact_id VARCHAR REFERENCES contact(id),
            type VARCHAR NOT NULL DEFAULT 'follow_up',
            priority VARCHAR NOT NULL DEFAULT 'medium',
            status VARCHAR NOT NULL DEFAULT 'pending',
            due_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE
        );

        -- Messages table
        CREATE TABLE IF NOT EXISTS message (
            id VARCHAR PRIMARY KEY,
            owner_id VARCHAR NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
            contact_id VARCHAR NOT NULL REFERENCES contact(id) ON DELETE CASCADE,
            channel VARCHAR NOT NULL,
            subject VARCHAR,
            body TEXT NOT NULL,
            provider_id VARCHAR,
            status VARCHAR NOT NULL DEFAULT 'queued',
            scheduled_at TIMESTAMP WITH TIME ZONE,
            sent_at TIMESTAMP WITH TIME ZONE,
            error TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Events table
        CREATE TABLE IF NOT EXISTS event (
            id BIGSERIAL PRIMARY KEY,
            message_id VARCHAR REFERENCES message(id) ON DELETE CASCADE,
            kind VARCHAR NOT NULL,
            meta TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_contact_owner_id ON contact(owner_id);
        CREATE INDEX IF NOT EXISTS idx_contact_email ON contact(email);
        CREATE INDEX IF NOT EXISTS idx_template_owner_id ON template(owner_id);
        CREATE INDEX IF NOT EXISTS idx_task_owner_id ON task(owner_id);
        CREATE INDEX IF NOT EXISTS idx_task_contact_id ON task(contact_id);
        CREATE INDEX IF NOT EXISTS idx_message_owner_id ON message(owner_id);
        CREATE INDEX IF NOT EXISTS idx_message_contact_id ON message(contact_id);
        """
        
        with engine.connect() as conn:
            conn.execute(text(create_tables_sql))
            conn.commit()
        
        print("✅ All tables created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False

def create_sample_data():
    """Create sample data for testing"""
    try:
        from app.db.database import SessionLocal
        from passlib.context import CryptContext
        import uuid
        
        # Use a more compatible password hashing method
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # Create engine for raw SQL
        engine = create_engine(settings.DATABASE_URL)
        
        # Generate UUIDs
        user_id = str(uuid.uuid4())
        contact1_id = str(uuid.uuid4())
        contact2_id = str(uuid.uuid4())
        template_id = str(uuid.uuid4())
        task1_id = str(uuid.uuid4())
        task2_id = str(uuid.uuid4())
        
        # Hash password
        hashed_password = pwd_context.hash("password123")
        
        # Insert sample data using raw SQL
        sample_data_sql = f"""
        -- Insert sample user
        INSERT INTO app_user (id, email, password_hash)
        VALUES ('{user_id}', 'test@example.com', '{hashed_password}')
        ON CONFLICT (email) DO NOTHING;

        -- Insert sample contacts
        INSERT INTO contact (id, owner_id, email, first_name, last_name, phone, company)
        VALUES 
            ('{contact1_id}', '{user_id}', 'john.doe@example.com', 'John', 'Doe', '+1234567890', 'Acme Corp'),
            ('{contact2_id}', '{user_id}', 'jane.smith@techstart.com', 'Jane', 'Smith', '+1987654321', 'TechStart Inc')
        ON CONFLICT (id) DO NOTHING;

        -- Insert sample template
        INSERT INTO template (id, owner_id, name, subject, body, channel)
        VALUES ('{template_id}', '{user_id}', 'Welcome Message', 'Welcome to our platform!', 'Hi {{first_name}},\n\nWelcome to our platform! We''re excited to have you on board.\n\nBest regards,\nThe Team', 'email')
        ON CONFLICT (id) DO NOTHING;

        -- Insert sample tasks
        INSERT INTO task (id, owner_id, title, description, contact_id, type, priority, status)
        VALUES 
            ('{task1_id}', '{user_id}', 'Follow up with John Doe', 'Send follow-up email about the interview', '{contact1_id}', 'follow_up', 'high', 'pending'),
            ('{task2_id}', '{user_id}', 'Research TechStart Inc', 'Look into company culture and recent news', '{contact2_id}', 'research', 'medium', 'in_progress')
        ON CONFLICT (id) DO NOTHING;
        """
        
        with engine.connect() as conn:
            conn.execute(text(sample_data_sql))
            conn.commit()
        
        print("✅ Sample data created successfully!")
        print(f"   - Test user: test@example.com / password123")
        print(f"   - Created 2 sample contacts")
        print(f"   - Created 1 sample template")
        print(f"   - Created 2 sample tasks")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🚀 Setting up Supabase database...")
    
    # Create tables
    if create_tables():
        # Ask if user wants sample data
        response = input("\nWould you like to create sample data? (y/n): ")
        if response.lower() in ['y', 'yes']:
            create_sample_data()
    
    print("\n✨ Setup complete!")
