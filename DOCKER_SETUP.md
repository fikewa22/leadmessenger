# Docker Setup Guide

This guide will help you set up LeadMessenger using Docker for easy development and deployment.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd leadmessenger
   ```

2. **Run the setup script**:
   ```bash
   ./setup-docker.sh
   ```

   This script will:
   - Check if Docker is installed
   - Create a `.env` file with default configuration
   - Build and start all services
   - Wait for services to be healthy

3. **Update configuration**:
   - Edit the `.env` file and add your actual values:
     - `DATABASE_URL` (your Supabase connection string)
     - `EXPO_PUBLIC_OPENROUTER_API_KEY` (your OpenRouter API key)

4. **Setup the database**:
   ```bash
   docker compose exec backend python setup_supabase.py
   ```

5. **Start the mobile app**:
   ```bash
   cd mobile
   npm start
   ```

## Services

The Docker setup includes the following services:

- **Backend API** (FastAPI): `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432` (optional - for local development)
- **Redis Cache**: `localhost:6379`

## Environment Variables

The following environment variables are used:

### Database
- `DATABASE_URL`: PostgreSQL connection string (Supabase recommended)
- `SUPABASE_URL`: Supabase project URL (optional)
- `SUPABASE_KEY`: Supabase anonymous key (optional)

### JWT Authentication
- `SECRET_KEY`: Secret key for JWT tokens
- `ALGORITHM`: JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `REFRESH_TOKEN_EXPIRE_DAYS`: Refresh token expiration

### CORS
- `ALLOWED_ORIGINS`: List of allowed origins for CORS

### AI/OpenRouter
- `EXPO_PUBLIC_OPENROUTER_API_KEY`: Your OpenRouter API key for AI template generation

### Redis
- `REDIS_URL`: Redis connection string

### Mobile App
- `EXPO_PUBLIC_API_URL`: Backend API URL for mobile app

### Email/SMS Providers (Optional)
- `RESEND_API_KEY`: Resend email service
- `SENDGRID_API_KEY`: SendGrid email service
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Twilio phone number

## Deployment Options

### Option 1: Full Stack (Backend + PostgreSQL + Redis)
```bash
docker compose up -d
```

### Option 2: Backend + Redis Only (with Supabase)
```bash
docker compose up backend redis -d
```

### Option 3: Backend Only (with external services)
```bash
docker compose up backend -d
```

## Useful Commands

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
```

### Stop services
```bash
docker compose down
```

### Restart services
```bash
docker compose restart
```

### Rebuild services
```bash
docker compose up --build
```

### Access backend shell
```bash
docker compose exec backend bash
```

### Run database migrations
```bash
docker compose exec backend python setup_supabase.py
```

## Development

### Making changes to the backend
The backend code is mounted as a volume, so changes will be reflected immediately. However, you may need to restart the service for some changes:

```bash
docker compose restart backend
```

### Database changes
If you modify the database schema, you'll need to run the setup script again:

```bash
docker compose exec backend python setup_supabase.py
```

## Troubleshooting

### Services not starting
Check the logs for errors:
```bash
docker compose logs
```

### Database connection issues
Make sure your `DATABASE_URL` is correct in the `.env` file.

### Port conflicts
If you have other services running on the same ports, modify the `docker-compose.yml` file to use different ports.

### Permission issues
On Linux, you might need to run Docker commands with `sudo` or add your user to the docker group.

## Production Deployment

For production deployment:

1. Update the `.env` file with production values
2. Use a proper secret key
3. Set up proper CORS origins
4. Use a production database (Supabase recommended)
5. Consider using Docker Swarm or Kubernetes for orchestration

## Cleanup

To completely remove all containers, volumes, and images:

```bash
docker compose down -v --rmi all
```

This will remove all data, so use with caution!

## Environment File Structure

Your `.env` file should be organized like this:

```bash
# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DATABASE_URL=postgresql://postgres:your_password@your_supabase_host:5432/postgres

# =============================================================================
# JWT AUTHENTICATION
# =============================================================================
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# =============================================================================
# AI/OPENROUTER CONFIGURATION
# =============================================================================
EXPO_PUBLIC_OPENROUTER_API_KEY=your-openrouter-api-key

# =============================================================================
# CACHE/REDIS CONFIGURATION
# =============================================================================
REDIS_URL=redis://redis:6379

# =============================================================================
# MOBILE APP CONFIGURATION
# =============================================================================
EXPO_PUBLIC_API_URL=http://localhost:8000
```
