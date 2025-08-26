import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const TemplatesScreen = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Templates</Text>
        <TouchableOpacity className="bg-primary-600 px-4 py-2 rounded-lg">
          <Text className="text-white font-semibold">New Template</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600 text-lg mb-4">No templates yet</Text>
        <Text className="text-gray-500 text-center">
          Create your first email, SMS, or WhatsApp template
        </Text>
      </View>
    </View>
  );
};
