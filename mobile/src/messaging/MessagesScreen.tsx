import React from 'react';
import { View, Text } from 'react-native';

export const MessagesScreen = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Messages</Text>
      </View>
      
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600 text-lg mb-4">No messages yet</Text>
        <Text className="text-gray-500 text-center">
          Messages from your communications will appear here
        </Text>
      </View>
    </View>
  );
};
