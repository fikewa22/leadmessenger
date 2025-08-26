# Supabase Setup Guide

This guide will help you set up Supabase as the database for your LeadMessenger backend.

## Prerequisites

1. A Supabase account ([sign up here](https://supabase.com))
2. Python 3.8+ installed
3. The backend codebase

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `leadmessenger` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Database Connection Details

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Find the **Connection string** section
3. Copy the **URI** (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`)
4. Go to **Settings** → **API**
5. Copy the **Project URL** and **anon public** key

## Step 3: Configure Environment Variables

1. In the `backend` directory, create a `.env` file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your Supabase details:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_KEY=your-anon-key-here
   DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
   
   # JWT Settings
   SECRET_KEY=your-super-secret-key-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   
   # Environment
   ENVIRONMENT=development
   DEBUG=true
   ```

## Step 4: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 5: Set Up Database Tables

Run the setup script to create all necessary tables:

```bash
python setup_supabase.py
```

This script will:
- Connect to your Supabase database
- Create all required tables
- Optionally create sample data for testing

## Step 6: Test the Connection

Start the backend server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit `http://localhost:8000/docs` to see the API documentation.

## Step 7: Update Mobile App Configuration

Update your mobile app's API URL to point to your backend:

1. In the `mobile` directory, create a `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:8000
   ```

2. For production, use your deployed backend URL instead of localhost.

## Database Schema

The setup script creates the following tables:

- **users**: User accounts and authentication
- **contacts**: Contact information and management
- **templates**: Email and message templates
- **tasks**: Job search task management
- **messages**: Message history and tracking

## Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your Supabase project is active
- Ensure your IP is not blocked by Supabase

### Permission Issues
- Make sure you're using the correct API keys
- Check that your database password is correct

### Table Creation Issues
- Run the setup script again
- Check the console output for specific error messages
- Verify all environment variables are set correctly

## Security Notes

1. **Never commit your `.env` file** to version control
2. **Use strong passwords** for your database
3. **Rotate your JWT secret key** in production
4. **Set up Row Level Security (RLS)** in Supabase for production use

## Production Deployment

For production deployment:

1. Set `ENVIRONMENT=production`
2. Set `DEBUG=false`
3. Use a strong, unique `SECRET_KEY`
4. Configure proper CORS settings
5. Set up SSL/TLS certificates
6. Configure Supabase Row Level Security policies

## Next Steps

After setup, you can:

1. Test the API endpoints
2. Create your first user account
3. Add contacts and test the mobile app
4. Set up email/SMS providers
5. Configure task management

## Support

If you encounter issues:

1. Check the Supabase documentation
2. Review the console output for error messages
3. Verify all environment variables are set correctly
4. Test the database connection manually
