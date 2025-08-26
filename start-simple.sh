#!/bin/bash

echo "🚀 Starting LeadMessenger (Simple Setup with SQLite)..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
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
# Using SQLite for simple development
DATABASE_URL=sqlite:///./leadmessenger.db

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
    echo "✅ Created .env file with SQLite configuration"
fi

# Run migrations
echo "🗄️ Running database migrations..."
alembic upgrade head

# Start the server
echo "🚀 Starting FastAPI server..."
echo ""
echo "✅ LeadMessenger is ready!"
echo ""
echo "🌐 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "📱 To start the mobile app, open a new terminal and run:"
echo "   cd mobile && npx expo start"
echo ""
echo "🛑 To stop the backend, press Ctrl+C"

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
