import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingMessagesButtonProps {
  onPress: () => void;
  unreadCount?: number;
}

export const FloatingMessagesButton: React.FC<FloatingMessagesButtonProps> = ({
  onPress,
  unreadCount = 0,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-24 right-5 w-14 h-14 bg-blue-500 rounded-full shadow-lg items-center justify-center z-50"
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      
      {/* Unread Badge */}
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {unreadCount > 99 ? '99+' : unreadCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
