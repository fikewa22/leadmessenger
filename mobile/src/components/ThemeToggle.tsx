import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { ThemedView, ThemedText, ThemedIcon, ThemedDivider } from '../theme/components';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, themeMode, setThemeMode, isSystemTheme, setIsSystemTheme } = useTheme();

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'system') {
      setIsSystemTheme(true);
    } else {
      setThemeMode(mode);
    }
  };

  const getThemeIcon = (mode: 'light' | 'dark' | 'system') => {
    switch (mode) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
        return 'settings';
      default:
        return 'settings';
    }
  };

  const getThemeLabel = (mode: 'light' | 'dark' | 'system') => {
    switch (mode) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return 'System Default';
      default:
        return 'System Default';
    }
  };

  const isActive = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'system') {
      return isSystemTheme;
    }
    return !isSystemTheme && themeMode === mode;
  };

  return (
    <ThemedView variant="card" style={{ margin: 16, borderRadius: 12 }}>
      <ThemedText size="lg" weight="semibold" style={{ marginBottom: 16 }}>
        Appearance
      </ThemedText>
      
      {(['light', 'dark', 'system'] as const).map((mode, index) => (
        <React.Fragment key={mode}>
          <TouchableOpacity
            onPress={() => handleThemeChange(mode)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
            activeOpacity={0.7}
          >
            <ThemedIcon
              name={getThemeIcon(mode) as any}
              size={20}
              color={isActive(mode) ? theme.colors.primary[500] : theme.colors.text.secondary}
              style={{ marginRight: 12 }}
            />
            
            <ThemedText
              style={{ 
                flex: 1,
                color: isActive(mode) ? theme.colors.primary[500] : theme.colors.text.primary
              }}
            >
              {getThemeLabel(mode)}
            </ThemedText>
            
            {isActive(mode) && (
              <ThemedIcon
                name="checkmark"
                size={20}
                color={theme.colors.primary[500]}
              />
            )}
          </TouchableOpacity>
          
          {index < 2 && (
            <ThemedDivider style={{ marginHorizontal: 16 }} />
          )}
        </React.Fragment>
      ))}
    </ThemedView>
  );
};
