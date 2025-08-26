# LeadMessenger - Quick Start Guide

## 🎉 Project Status

✅ **Backend**: FastAPI server with SQLite database  
✅ **Mobile App**: React Native with Expo  
✅ **Authentication**: JWT-based login/register  
✅ **Database**: All models created and working  

## 🚀 Getting Started

### Step 1: Start the Backend

The backend should already be running. If not:

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Test the backend**: Visit http://localhost:8000/docs

### Step 2: Start the Mobile App

```bash
cd mobile
npx expo start
```

### Step 3: Run on Your Device

#### Option A: Physical Device (Recommended)

1. **Install Expo Go** on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR code** from the terminal:
   - iOS: Use the Camera app
   - Android: Use the Expo Go app

#### Option B: iOS Simulator (macOS)

1. Install Xcode from App Store
2. Press `i` in the Expo terminal

#### Option C: Android Emulator

1. Install Android Studio
2. Set up an AVD
3. Press `a` in the Expo terminal

## 🔧 Troubleshooting

### Expo Go Crashes

**The issue**: You're trying to run Expo Go on macOS instead of a mobile device.

**Solution**: 
- Install Expo Go on your **phone** (not Mac)
- Make sure your phone and computer are on the same WiFi
- Scan the QR code with your phone

### Backend Connection Issues

**Check if backend is running**:
```bash
curl http://localhost:8000/health
```

**Should return**: `{"status": "healthy"}`

### Mobile App Can't Connect

1. **Check the API URL**: Make sure `.env` contains:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:8000
   ```

2. **If using physical device**: Your phone needs to reach your computer's IP address

## 📱 What You Can Do Now

1. **Register/Login**: Create your account
2. **Add Contacts**: Manage your contact list
3. **Create Templates**: Build email/SMS templates
4. **View Tasks**: See the task management system
5. **Track Messages**: Monitor your outreach campaigns

## 🛠️ Development

### Backend Development
- **API Docs**: http://localhost:8000/docs
- **Auto-reload**: Changes are automatically reflected
- **Database**: SQLite file at `backend/leadmessenger.db`

### Mobile Development
- **Hot reload**: Changes appear instantly on device
- **Debug**: Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- **Logs**: Check terminal for detailed logs

## 📁 Project Structure

```
leadmessenger/
├── backend/                 # FastAPI server
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── models/         # Database models
│   │   └── schemas/        # Pydantic schemas
│   └── leadmessenger.db    # SQLite database
├── mobile/                  # React Native app
│   ├── src/
│   │   ├── auth/          # Login/Register
│   │   ├── contacts/      # Contact management
│   │   ├── templates/     # Template builder
│   │   └── navigation/    # App navigation
│   └── .env               # API configuration
└── README.md              # Full documentation
```

## 🎯 Next Features

- [ ] Advanced task analytics
- [ ] Email/SMS sending integration
- [ ] Message tracking and analytics
- [ ] Offline support
- [ ] Push notifications
- [ ] CSV import/export

## 🆘 Need Help?

1. **Check the logs** in both terminal windows
2. **Visit the API docs**: http://localhost:8000/docs
3. **Restart the servers** if needed
4. **Clear Expo cache**: Settings > Clear Cache in Expo Go

## 🚀 Ready to Deploy?

The project is ready for production deployment:

- **Backend**: Deploy to Render, Railway, or Fly.io
- **Mobile**: Build with EAS Build for App Store/Play Store
- **Database**: Migrate to PostgreSQL for production

---

**Happy coding!** 🎉
