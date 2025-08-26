import React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { 
  ThemedView, 
  ThemedText, 
  ThemedButton, 
  ThemedCard,
  ThemedIcon,
  ThemedDivider 
} from '../theme/components';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderMenuItem = (icon: string, title: string, onPress?: () => void) => (
    <ThemedButton
      onPress={onPress || (() => {})}
      variant="ghost"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <ThemedIcon name={icon as any} size={20} style={{ marginRight: 12 }} />
        <ThemedText weight="medium">{title}</ThemedText>
      </View>
      <ThemedIcon name="chevron-forward" size={16} />
    </ThemedButton>
  );

  return (
    <ThemedView variant="primary" style={{ flex: 1 }}>
      <ScrollView>
        {/* Header */}
        <ThemedView variant="card" style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
          <ThemedText size="2xl" weight="bold">Profile</ThemedText>
        </ThemedView>

        {/* User Info */}
        <ThemedCard variant="elevated" style={{ margin: 16, alignItems: 'center', padding: 24 }}>
          <View style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 40, 
            backgroundColor: '#3b82f6', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 16 
          }}>
            <ThemedText size="2xl" weight="bold" variant="inverse">U</ThemedText>
          </View>
          <ThemedText size="lg" weight="semibold" style={{ marginBottom: 4 }}>
            user@example.com
          </ThemedText>
          <ThemedText variant="secondary" size="sm">
            Member since {new Date().toLocaleDateString()}
          </ThemedText>
        </ThemedCard>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Menu Items */}
        <ThemedCard variant="elevated" style={{ margin: 16 }}>
          {renderMenuItem('settings-outline', 'Account Settings')}
          {renderMenuItem('notifications-outline', 'Notification Preferences')}
          {renderMenuItem('help-circle-outline', 'Help & Support')}
          {renderMenuItem('shield-outline', 'Privacy Policy')}
          {renderMenuItem('document-text-outline', 'Terms of Service')}
        </ThemedCard>

        {/* Logout Button */}
        <View style={{ padding: 16 }}>
          <ThemedButton
            onPress={handleLogout}
            variant="outline"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: '#ef4444',
              borderWidth: 1,
            }}
          >
            <ThemedText style={{ color: '#ef4444' }} weight="semibold">
              Logout
            </ThemedText>
          </ThemedButton>
        </View>
      </ScrollView>
    </ThemedView>
  );
};
