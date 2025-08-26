#!/bin/bash

echo "🚀 Starting LeadMessenger (Cloud Setup)..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip first."
    exit 1
fi

echo "📦 Setting up Python environment..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database - Use a cloud PostgreSQL service
# Options: Supabase, Neon, Railway, etc.
DATABASE_URL=postgresql://your-username:your-password@your-host:5432/leadmessenger

# Redis - Use a cloud Redis service  
# Options: Upstash Redis, Redis Cloud, etc.
REDIS_URL=redis://your-redis-url

# JWT Secret (change this in production)
SECRET_KEY=your-secret-key-change-in-production

# Email providers (optional for now)
RESEND_API_KEY=
SENDGRID_API_KEY=

# SMS/WhatsApp providers (optional for now)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
EOF
    echo ""
    echo "⚠️  IMPORTANT: You need to set up cloud services for database and Redis."
    echo ""
    echo "📋 Quick Setup Guide:"
    echo ""
    echo "1. Database (PostgreSQL):"
    echo "   - Go to https://supabase.com (free tier)"
    echo "   - Create a new project"
    echo "   - Go to Settings > Database"
    echo "   - Copy the connection string"
    echo "   - Update DATABASE_URL in .env"
    echo ""
    echo "2. Redis:"
    echo "   - Go to https://upstash.com (free tier)"
    echo "   - Create a new Redis database"
    echo "   - Copy the connection string"
    echo "   - Update REDIS_URL in .env"
    echo ""
    echo "3. After setting up the services, run:"
    echo "   alembic upgrade head"
    echo ""
    echo "4. Then start the server:"
    echo "   uvicorn app.main:app --reload"
    echo ""
    exit 0
fi

echo "✅ Environment is ready!"
echo ""
echo "🌐 Backend API will be available at: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "📱 To start the mobile app, open a new terminal and run:"
echo "   cd mobile && npx expo start"
echo ""
echo "🛑 To stop the backend, press Ctrl+C"

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
