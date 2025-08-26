# LeadMessenger Mobile App

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** (already installed)
2. **Expo CLI** (install globally)
3. **Mobile Device** (iOS/Android) or **Simulator**

### Installation

1. **Install Expo CLI globally**:
   ```bash
   npm install -g @expo/cli
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   echo "EXPO_PUBLIC_API_URL=http://localhost:8000" > .env
   ```

### Running the App

#### Option 1: Physical Device (Recommended)

1. **Install Expo Go on your phone**:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server**:
   ```bash
   npx expo start
   ```

3. **Scan the QR code**:
   - iOS: Use the Camera app
   - Android: Use the Expo Go app

#### Option 2: iOS Simulator (macOS only)

1. **Install Xcode** from the App Store
2. **Start the development server**:
   ```bash
   npx expo start
   ```
3. **Press `i`** to open iOS simulator

#### Option 3: Android Emulator

1. **Install Android Studio**
2. **Set up an Android Virtual Device (AVD)**
3. **Start the development server**:
   ```bash
   npx expo start
   ```
4. **Press `a`** to open Android emulator

### Troubleshooting

#### Expo Go Crashes

- **Make sure you're using Expo Go on a mobile device, not on macOS**
- **Check that your phone and computer are on the same WiFi network**
- **Try restarting the Expo Go app**
- **Clear Expo Go cache**: Settings > Clear Cache

#### Can't Connect to Backend

- **Make sure the backend is running**: `http://localhost:8000`
- **Check the API URL in `.env`**: Should be `http://localhost:8000`
- **If using a physical device**: Make sure your phone can reach your computer's IP address

#### Common Issues

1. **"Metro bundler" errors**: Try `npx expo start --clear`
2. **"Unable to resolve module"**: Try `npm install` again
3. **"Network request failed"**: Check your network connection

### Development

- **Hot reload**: Changes are automatically reflected
- **Debug**: Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- **Logs**: Check the terminal for detailed logs

### Building for Production

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Project Structure

```
src/
├── api/           # API client and endpoints
├── auth/          # Authentication screens and context
├── contacts/      # Contact management screens
├── templates/     # Template management screens
├── tasks/         # Task management screens
├── messaging/     # Message tracking screens
├── navigation/    # App navigation setup
└── utils/         # Utilities and helpers
```

### Features

- ✅ User authentication (login/register)
- ✅ Contact management
- ✅ Template creation
- ✅ Task management
- ✅ Message tracking
- ✅ Offline support (coming soon)
- ✅ Push notifications (coming soon)

### Next Steps

1. **Test the backend API**: Visit `http://localhost:8000/docs`
2. **Create a user account**: Use the register screen
3. **Add contacts**: Test the contact management
4. **Create templates**: Build your first email/SMS template
5. **Manage tasks**: Track job search activities

Happy coding! 🚀
