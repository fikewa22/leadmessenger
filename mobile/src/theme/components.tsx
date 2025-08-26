import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

// Themed View component
export const ThemedView: React.FC<{
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'card' | 'modal';
}> = ({ children, style, variant = 'primary' }) => {
  const { theme } = useTheme();
  
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.colors.background.secondary;
      case 'tertiary':
        return theme.colors.background.tertiary;
      case 'card':
        return theme.colors.background.card;
      case 'modal':
        return theme.colors.background.modal;
      default:
        return theme.colors.background.primary;
    }
  };

  return (
    <View style={[{ backgroundColor: getBackgroundColor() }, style]}>
      {children}
    </View>
  );
};

// Themed Text component
export const ThemedText: React.FC<{
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'muted';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}> = ({ children, style, variant = 'primary', size = 'base', weight = 'regular' }) => {
  const { theme } = useTheme();
  
  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.colors.text.secondary;
      case 'tertiary':
        return theme.colors.text.tertiary;
      case 'inverse':
        return theme.colors.text.inverse;
      case 'muted':
        return theme.colors.text.muted;
      default:
        return theme.colors.text.primary;
    }
  };

  const getFontSize = () => {
    return theme.typography.fontSize[size];
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'medium':
        return '500';
      case 'semibold':
        return '600';
      case 'bold':
        return '700';
      default:
        return '400';
    }
  };

  return (
    <Text
      style={[
        {
          color: getTextColor(),
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// Themed Button component
export const ThemedButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}> = ({ 
  children, 
  onPress, 
  style, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false 
}) => {
  const { theme } = useTheme();
  
  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    const sizeStyles = {
      sm: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
      md: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md },
      lg: { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? theme.colors.gray[300] : theme.colors.primary[500],
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.gray[300] : theme.colors.secondary[500],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.colors.gray[300] : theme.colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.gray[500];
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.text.inverse;
      case 'outline':
        return theme.colors.primary[500];
      case 'ghost':
        return theme.colors.text.primary;
      default:
        return theme.colors.text.inverse;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
        />
      ) : (
        <ThemedText
          variant={variant === 'primary' || variant === 'secondary' ? 'inverse' : 'primary'}
          weight="semibold"
          style={{ color: getTextColor() }}
        >
          {children}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

// Themed Input component
export const ThemedInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}> = ({ 
  value, 
  onChangeText, 
  placeholder, 
  style, 
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default'
}) => {
  const { theme } = useTheme();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.text.muted}
      multiline={multiline}
      numberOfLines={numberOfLines}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={[
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.primary,
          borderWidth: 1,
          borderRadius: theme.borderRadius.lg,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.md,
          color: theme.colors.text.primary,
          fontSize: theme.typography.fontSize.base,
          textAlignVertical: multiline ? 'top' : 'center',
        },
        style,
      ]}
    />
  );
};

// Themed Card component
export const ThemedCard: React.FC<{
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'elevated' | 'outlined';
}> = ({ children, style, variant = 'default' }) => {
  const { theme } = useTheme();
  
  const getCardStyles = () => {
    const baseStyles = {
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          ...theme.shadows.lg,
        };
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
        };
      default:
        return {
          ...baseStyles,
          ...theme.shadows.sm,
        };
    }
  };

  return (
    <View style={[getCardStyles(), style]}>
      {children}
    </View>
  );
};

// Themed Icon component
export const ThemedIcon: React.FC<{
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: any;
}> = ({ name, size = 24, color, style }) => {
  const { theme } = useTheme();
  
  const iconColor = color || theme.colors.text.secondary;

  return (
    <Ionicons 
      name={name} 
      size={size} 
      color={iconColor} 
      style={style}
    />
  );
};

// Themed Modal component
export const ThemedModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
}> = ({ 
  visible, 
  onRequestClose, 
  children, 
  animationType = 'slide',
  presentationStyle = 'pageSheet'
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={onRequestClose}
    >
      <ThemedView variant="modal" style={{ flex: 1 }}>
        {children}
      </ThemedView>
    </Modal>
  );
};

// Themed Divider component
export const ThemedDivider: React.FC<{
  style?: any;
  variant?: 'primary' | 'secondary' | 'tertiary';
}> = ({ style, variant = 'primary' }) => {
  const { theme } = useTheme();
  
  const getBorderColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.colors.border.secondary;
      case 'tertiary':
        return theme.colors.border.tertiary;
      default:
        return theme.colors.border.primary;
    }
  };

  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: getBorderColor(),
        },
        style,
      ]}
    />
  );
};

// Themed Badge component
export const ThemedBadge: React.FC<{
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}> = ({ children, style, variant = 'primary', size = 'md' }) => {
  const { theme } = useTheme();
  
  const getBadgeStyles = () => {
    const baseStyles = {
      borderRadius: theme.borderRadius.full,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    const sizeStyles = {
      sm: { paddingHorizontal: theme.spacing.sm, paddingVertical: 2 },
      md: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
      lg: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm },
    };

    const variantStyles = {
      primary: { backgroundColor: theme.colors.primary[100] },
      secondary: { backgroundColor: theme.colors.secondary[100] },
      success: { backgroundColor: theme.colors.success[100] },
      warning: { backgroundColor: theme.colors.warning[100] },
      error: { backgroundColor: theme.colors.error[100] },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary[700];
      case 'secondary':
        return theme.colors.secondary[700];
      case 'success':
        return theme.colors.success[700];
      case 'warning':
        return theme.colors.warning[700];
      case 'error':
        return theme.colors.error[700];
      default:
        return theme.colors.primary[700];
    }
  };

  return (
    <View style={[getBadgeStyles(), style]}>
      <ThemedText
        size="xs"
        weight="medium"
        style={{ color: getTextColor() }}
      >
        {children}
      </ThemedText>
    </View>
  );
};
