// Environment configuration
export const ENV = {
  // API URLs
  API_URL: 'https://8d6328f8b64f.ngrok-free.app', // Hardcoded for testing
  
  // OpenRouter API
  OPENROUTER_API_KEY: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '',
  
  // App configuration
  APP_NAME: 'LeadMessenger',
  APP_VERSION: '1.0.0',
};

// Validate required environment variables
export const validateEnv = () => {
  const required = ['EXPO_PUBLIC_API_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  if (!ENV.OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not found. AI template generation will not work.');
  }
};
