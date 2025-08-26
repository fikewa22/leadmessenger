import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from './AuthContext';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
      </View>
      
      <View className="bg-gray-50 rounded-lg p-4 mb-6">
        <Text className="text-sm text-gray-600 mb-1">Email</Text>
        <Text className="text-lg font-medium text-gray-900">{user?.email}</Text>
      </View>
      
      <View className="bg-gray-50 rounded-lg p-4 mb-6">
        <Text className="text-sm text-gray-600 mb-1">Member Since</Text>
        <Text className="text-lg font-medium text-gray-900">
          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      
      <TouchableOpacity
        className="bg-red-600 rounded-lg py-3"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};
