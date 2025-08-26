import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ContactsScreen } from '../screens/ContactsScreen';
import { TemplatesScreen } from '../screens/TemplatesScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { FloatingMessagesButton } from '../components/FloatingMessagesButton';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();



export const MainNavigator: React.FC = () => {
  const { theme } = useTheme();
  const [showMessages, setShowMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Mock unread count
  const [currentRoute, setCurrentRoute] = useState('Contacts');

  const tabBarStyles = {
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    paddingBottom: 20,  
    paddingTop: 5,
    height: 80,  
  };

  const handleMessagesPress = () => {
    setShowMessages(true);
  };

  const handleCloseMessages = () => {
    setShowMessages(false);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background.card,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.text.primary,
          },
          tabBarActiveTintColor: theme.colors.primary[500],
          tabBarInactiveTintColor: theme.colors.text.tertiary,
          tabBarStyle: tabBarStyles,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Contacts') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Templates') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Tasks') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        screenListeners={{
          focus: (e) => {
            setCurrentRoute(e.target?.split('-')[0] || 'Contacts');
          },
        }}
      >
        <Tab.Screen 
          name="Contacts" 
          component={ContactsScreen}
          options={{
            title: 'Contacts',
            tabBarLabel: 'Contacts',
          }}
        />
        <Tab.Screen 
          name="Templates" 
          component={TemplatesScreen}
          options={{
            title: 'Templates',
            tabBarLabel: 'Templates',
          }}
        />
        <Tab.Screen 
          name="Tasks" 
          component={TasksScreen}
          options={{
            title: 'Tasks',
            tabBarLabel: 'Tasks',
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
          }}

        />
      </Tab.Navigator>

      {/* Floating Messages Button - Show on all screens except Profile */}
      {currentRoute !== 'Profile' && (
        <FloatingMessagesButton 
          onPress={handleMessagesPress}
          unreadCount={unreadCount}
        />
      )}

      {/* Messages Modal */}
      <MessagesScreen 
        visible={showMessages}
        onClose={handleCloseMessages}
      />
    </>
  );
};
