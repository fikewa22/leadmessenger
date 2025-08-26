#!/bin/bash

echo "🚀 Starting LeadMessenger (Local Development)..."

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

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. You'll need to install it or use a cloud database."
    echo "   For macOS: brew install postgresql"
    echo "   For Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    echo "   Or use a cloud service like Supabase or Neon"
    exit 1
fi

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "⚠️  Redis is not installed. You'll need to install it or use a cloud Redis service."
    echo "   For macOS: brew install redis"
    echo "   For Ubuntu: sudo apt-get install redis-server"
    echo "   Or use a cloud service like Upstash Redis"
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
DATABASE_URL=postgresql://postgres:password@localhost/leadmessenger
SECRET_KEY=your-secret-key-change-in-production
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=
SENDGRID_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
EOF
    echo "✅ Created .env file. Please edit it with your database credentials and API keys."
fi

# Start Redis in background
echo "🔄 Starting Redis..."
redis-server --daemonize yes

# Start PostgreSQL if not running
echo "🔄 Starting PostgreSQL..."
brew services start postgresql 2>/dev/null || sudo systemctl start postgresql 2>/dev/null || echo "Please start PostgreSQL manually"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
sleep 3

# Create database if it doesn't exist
echo "🗄️ Setting up database..."
createdb leadmessenger 2>/dev/null || echo "Database already exists or couldn't create it"

# Run migrations
echo "🗄️ Running database migrations..."
alembic upgrade head

# Start the backend server
echo "🚀 Starting FastAPI server..."
echo ""
echo "✅ LeadMessenger backend is starting!"
echo ""
echo "🌐 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "📱 To start the mobile app, open a new terminal and run:"
echo "   cd mobile && npx expo start"
echo ""
echo "🛑 To stop the backend, press Ctrl+C"
echo "🛑 To stop Redis: redis-cli shutdown"
echo "🛑 To stop PostgreSQL: brew services stop postgresql"

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
