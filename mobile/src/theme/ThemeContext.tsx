import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeMode, Theme, getTheme } from './index';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  setIsSystemTheme: (isSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';
const SYSTEM_THEME_STORAGE_KEY = '@system_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isSystemTheme, setIsSystemThemeState] = useState(true);

  // Load saved theme preferences
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const savedSystemTheme = await AsyncStorage.getItem(SYSTEM_THEME_STORAGE_KEY);
        
        if (savedSystemTheme !== null) {
          const isSystem = JSON.parse(savedSystemTheme);
          setIsSystemThemeState(isSystem);
          
          if (isSystem) {
            setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
          } else if (savedThemeMode) {
            setThemeModeState(savedThemeMode as ThemeMode);
          }
        } else {
          // Default to system theme
          setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error);
        // Fallback to system theme
        setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    };

    loadThemePreferences();
  }, [systemColorScheme]);

  // Update theme when system color scheme changes
  useEffect(() => {
    if (isSystemTheme) {
      setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [systemColorScheme, isSystemTheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setIsSystemThemeState(false);
      await AsyncStorage.setItem(SYSTEM_THEME_STORAGE_KEY, 'false');
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const setIsSystemTheme = async (isSystem: boolean) => {
    try {
      setIsSystemThemeState(isSystem);
      await AsyncStorage.setItem(SYSTEM_THEME_STORAGE_KEY, JSON.stringify(isSystem));
      
      if (isSystem) {
        const newMode = systemColorScheme === 'dark' ? 'dark' : 'light';
        setThemeModeState(newMode);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
      }
    } catch (error) {
      console.error('Error saving system theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const theme = getTheme(themeMode);

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
    isSystemTheme,
    setIsSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
