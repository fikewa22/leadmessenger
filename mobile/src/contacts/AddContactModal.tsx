import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsAPI } from '../api/client';

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ContactFormData {
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  position: string;
  phone: string;
  linkedin: string;
  tags: string[];
  status: string;
  source: string;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  visible,
  onClose,
}) => {
  console.log('AddContactModal rendered with visible:', visible);
  
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    first_name: '',
    last_name: '',
    company: '',
    position: '',
    phone: '',
    linkedin: '',
    tags: [],
    status: '',
    source: '',
  });

  const createContactMutation = useMutation({
    mutationFn: (data: ContactFormData) => {
      const contactData = {
        ...data,
        tags: data.tags ? data.tags.map(tag => tag.trim()) : [],
      };
      return contactsAPI.createContact(contactData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      Alert.alert('Success', 'Contact added successfully!');
      handleClose();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to add contact');
    },
  });

  const handleClose = () => {
    console.log('AddContactModal handleClose called');
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      company: '',
      position: '',
      phone: '',
      linkedin: '',
      tags: [],
      status: '',
      source: '',
    });
    onClose();
  };

  const handleSubmit = () => {
    console.log('AddContactModal handleSubmit called with data:', formData);
    if (!formData.first_name && !formData.last_name && !formData.email && !formData.phone) {
      Alert.alert('Error', 'Please provide at least a name, email, or phone number');
      return;
    }
    createContactMutation.mutate(formData);
  };

  const updateFormData = (field: keyof ContactFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-xl font-semibold text-gray-900">Add New Contact</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text className="text-gray-500 text-lg">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Form Fields */}
          <View className="space-y-4">
            {/* Name Fields */}
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">First Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  value={formData.first_name}
                  onChangeText={(value) => updateFormData('first_name', value)}
                  placeholder="First name"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">Last Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  value={formData.last_name}
                  onChangeText={(value) => updateFormData('last_name', value)}
                  placeholder="Last name"
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Phone</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
              />
            </View>

            {/* Company */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Company</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                value={formData.company}
                onChangeText={(value) => updateFormData('company', value)}
                placeholder="Company name"
              />
            </View>

            {/* Tags */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Tags</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                value={formData.tags.join(', ')}
                onChangeText={(value) => updateFormData('tags', value.split(',').map(tag => tag.trim()))}
                placeholder="tag1, tag2, tag3"
              />
              <Text className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </Text>
            </View>


          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            className={`rounded-lg py-3 ${
              createContactMutation.isPending ? 'bg-gray-400' : 'bg-primary-600'
            }`}
            onPress={handleSubmit}
            disabled={createContactMutation.isPending}
          >
            {createContactMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">Add Contact</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
