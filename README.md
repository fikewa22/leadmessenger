# LeadMessenger

A lightweight, mobile-first outreach CRM where you store contacts, craft templates, manage tasks, and send messages via email/SMS/WhatsApp.

## 🚀 Features

- **Contacts Management**: Add, import, tag, and organize your contacts
- **Template System**: Create reusable templates with variable support
- **Task Management**: Track job search activities and follow-ups
- **Multi-channel Sending**: Email, SMS, and WhatsApp integration
- **Mobile-first Design**: Optimized for mobile devices
- **Offline Support**: Queue changes while offline, sync when connected

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with SQLAlchemy
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: JWT with refresh tokens
- **Queue System**: Redis + RQ for background jobs
- **Providers**: Resend (email), Twilio (SMS/WhatsApp)

### Mobile (React Native + Expo)
- **Framework**: React Native with Expo
- **State Management**: TanStack Query + MMKV
- **Forms**: React Hook Form + Zod validation
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation

## 📁 Project Structure

```
leadmessenger/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API routes
│   │   ├── core/           # Config, auth, utils
│   │   ├── db/             # Database setup
│   │   ├── models/         # SQLAlchemy models
│   │   └── schemas/        # Pydantic schemas
│   ├── alembic/            # Database migrations
│   └── requirements.txt    # Python dependencies
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── auth/          # Authentication
│   │   ├── contacts/      # Contact management
│   │   ├── templates/     # Template management
│   │   ├── tasks/         # Task management
│   │   ├── messaging/     # Message tracking
│   │   ├── navigation/    # App navigation
│   │   └── utils/         # Utilities
│   └── package.json       # Node dependencies
└── README.md
```

## 🛠️ Setup

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and provider credentials
   ```

3. **Set up database**:
   ```bash
   # Create PostgreSQL database
   createdb leadmessenger
   
   # Run migrations
   alembic upgrade head
   ```

4. **Start the server**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Mobile Setup

1. **Install dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # Create .env file
   EXPO_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/leadmessenger
SECRET_KEY=your-secret-key
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=your-resend-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

#### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## 📱 Usage

### Authentication
- Register with email and password
- JWT tokens are automatically managed
- Refresh tokens for seamless experience

### Contacts
- Add contacts manually or import CSV
- Tag contacts for organization
- Search and filter contacts

### Templates
- Create templates for email, SMS, or WhatsApp
- Use variables like `{{first_name}}`, `{{company}}`
- Preview templates with sample data

### Tasks
- Create and manage job search activities
- Track follow-ups and interviews
- Set priorities and due dates
- Monitor task completion

### Messages
- Track message delivery and engagement
- View open rates, clicks, and replies
- Handle bounces and unsubscribes

## 🚀 Deployment

### Backend Deployment
1. **Database**: Use Supabase or Neon for PostgreSQL
2. **API**: Deploy to Render, Railway, or Fly.io
3. **Redis**: Use Upstash for Redis
4. **Domain**: Set up with Cloudflare

### Mobile Deployment
1. **Build**: Use Expo EAS Build
2. **Distribution**: App Store and Google Play
3. **Updates**: Over-the-air updates with Expo

## 🔒 Security

- JWT authentication with short-lived access tokens
- Secure token storage with Expo SecureStore
- Rate limiting on API endpoints
- CORS configuration for mobile apps
- Input validation with Pydantic and Zod

## 📊 Monitoring

- Health check endpoint: `/health`
- Structured logging with loguru
- Error tracking with Sentry
- Database query monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Create an issue for bugs or feature requests
- Check the documentation for common questions
- Join our community for discussions

---

Built with ❤️ for modern outreach teams
