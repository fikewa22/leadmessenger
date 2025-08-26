#!/bin/bash

echo "🚀 Starting LeadMessenger..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Starting services with Docker Compose..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️ Running database migrations..."
docker-compose exec backend alembic upgrade head

echo "✅ LeadMessenger is ready!"
echo ""
echo "🌐 Backend API: http://localhost:8000"
echo "📱 Mobile app: Run 'cd mobile && npx expo start'"
echo ""
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "To stop the services, run: docker-compose down"
