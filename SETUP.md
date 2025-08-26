# LeadMessenger Setup Guide

## Quick Start (Without Docker)

### Prerequisites

1. **Python 3.8+**
   ```bash
   # Check if Python is installed
   python3 --version
   ```

2. **PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

3. **Redis**
   ```bash
   # macOS
   brew install redis
   brew services start redis
   
   # Ubuntu/Debian
   sudo apt-get install redis-server
   sudo systemctl start redis
   ```

4. **Node.js & npm** (for mobile app)
   ```bash
   # Install from https://nodejs.org/
   # or use nvm
   nvm install 18
   nvm use 18
   ```

### Backend Setup

1. **Clone and navigate to the project**:
   ```bash
   cd leadmessenger
   ```

2. **Run the local setup script**:
   ```bash
   ./start-local.sh
   ```

   This script will:
   - Create a Python virtual environment
   - Install dependencies
   - Create a `.env` file
   - Start PostgreSQL and Redis
   - Run database migrations
   - Start the FastAPI server

3. **Or set up manually**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Start services
   brew services start postgresql
   brew services start redis
   
   # Create database
   createdb leadmessenger
   
   # Run migrations
   alembic upgrade head
   
   # Start server
   uvicorn app.main:app --reload
   ```

### Mobile App Setup

1. **Install Expo CLI**:
   ```bash
   npm install -g @expo/cli
   ```

2. **Navigate to mobile directory**:
   ```bash
   cd mobile
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create environment file**:
   ```bash
   echo "EXPO_PUBLIC_API_URL=http://localhost:8000" > .env
   ```

5. **Start the development server**:
   ```bash
   npx expo start
   ```

6. **Run on device/simulator**:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost/leadmessenger
SECRET_KEY=your-secret-key-change-in-production
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=your-resend-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## Cloud Database Setup (Alternative)

If you don't want to install PostgreSQL locally:

### Option 1: Supabase (Free tier)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL from Settings > Database
4. Update `DATABASE_URL` in your `.env` file

### Option 2: Neon (Free tier)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Get your connection string
4. Update `DATABASE_URL` in your `.env` file

### Option 3: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL service
3. Get your connection string
4. Update `DATABASE_URL` in your `.env` file

## Cloud Redis Setup (Alternative)

### Option 1: Upstash Redis (Free tier)
1. Go to [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Get your connection string
4. Update `REDIS_URL` in your `.env` file

## Troubleshooting

### Common Issues

1. **PostgreSQL connection error**:
   ```bash
   # Check if PostgreSQL is running
   brew services list | grep postgresql
   
   # Start if not running
   brew services start postgresql
   ```

2. **Redis connection error**:
   ```bash
   # Check if Redis is running
   redis-cli ping
   
   # Start if not running
   brew services start redis
   ```

3. **Port already in use**:
   ```bash
   # Check what's using port 8000
   lsof -i :8000
   
   # Kill the process
   kill -9 <PID>
   ```

4. **Database migration errors**:
   ```bash
   # Reset database
   dropdb leadmessenger
   createdb leadmessenger
   alembic upgrade head
   ```

5. **Mobile app can't connect to backend**:
   - Make sure the backend is running on `http://localhost:8000`
   - Check that `EXPO_PUBLIC_API_URL` is set correctly
   - If using a physical device, make sure it's on the same network

### Getting Help

- Check the API documentation at `http://localhost:8000/docs`
- Look at the logs in the terminal
- Check the browser console for mobile app errors
- Create an issue in the repository

## Next Steps

Once you have the basic setup running:

1. **Test the API**: Visit `http://localhost:8000/docs`
2. **Create a user**: Use the `/auth/register` endpoint
3. **Test the mobile app**: Try logging in with your credentials
4. **Add contacts**: Use the mobile app or API to add some test contacts
5. **Create templates**: Build your first email/SMS template

Happy coding! 🚀
