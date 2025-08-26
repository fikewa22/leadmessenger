import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsAPI } from '../api/client';

interface Contact {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  position?: string;
  phone?: string;
  linkedin?: string;
  tags?: string[];
  status?: string;
  source?: string;
  created_at?: string;
}

interface ContactDetailScreenProps {
  contact: Contact;
  onClose: () => void;
}

export const ContactDetailScreen: React.FC<ContactDetailScreenProps> = ({
  contact,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: contact.email || '',
    phone: contact.phone || '',
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    company: contact.company || '',
    tags: contact.tags?.join(', ') || '',
  });

  const updateContactMutation = useMutation({
    mutationFn: (data: any) => {
      const contactData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
      };
      return contactsAPI.updateContact(contact.id, contactData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      Alert.alert('Success', 'Contact updated successfully!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to update contact');
    },
  });

  const handleSave = () => {
    updateContactMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      email: contact.email || '',
      phone: contact.phone || '',
      first_name: contact.first_name || '',
      last_name: contact.last_name || '',
      company: contact.company || '',
      tags: contact.tags?.join(', ') || '',

    });
    setIsEditing(false);
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDisplayName = () => {
    if (contact.first_name && contact.last_name) {
      return `${contact.first_name} ${contact.last_name}`;
    } else if (contact.first_name) {
      return contact.first_name;
    } else if (contact.last_name) {
      return contact.last_name;
    } else if (contact.email) {
      return contact.email;
    } else if (contact.phone) {
      return contact.phone;
    }
    return 'Unknown Contact';
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Contact' : 'Contact Details'}
          </Text>
          <View className="flex-row space-x-2">
            {isEditing ? (
              <>
                <TouchableOpacity
                  className="px-3 py-1 rounded-lg bg-gray-200"
                  onPress={handleCancel}
                  disabled={updateContactMutation.isPending}
                >
                  <Text className="text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-3 py-1 rounded-lg bg-primary-600"
                  onPress={handleSave}
                  disabled={updateContactMutation.isPending}
                >
                  {updateContactMutation.isPending ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text className="text-white">Save</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  className="px-3 py-1 rounded-lg bg-primary-600"
                  onPress={() => setIsEditing(true)}
                >
                  <Text className="text-white">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-3 py-1 rounded-lg bg-gray-200"
                  onPress={onClose}
                >
                  <Text className="text-gray-700">Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          {isEditing ? (
            // Edit Form
            <View className="space-y-4">
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

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Company</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  value={formData.company}
                  onChangeText={(value) => updateFormData('company', value)}
                  placeholder="Company name"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Tags</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  value={formData.tags}
                  onChangeText={(value) => updateFormData('tags', value)}
                  placeholder="tag1, tag2, tag3"
                />
                <Text className="text-xs text-gray-500 mt-1">
                  Separate multiple tags with commas
                </Text>
              </View>


            </View>
          ) : (
            // View Mode
            <View className="space-y-6">
              <View className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {getDisplayName()}
                </Text>
                {contact.company && (
                  <Text className="text-gray-600 text-lg">{contact.company}</Text>
                )}
              </View>

              <View className="space-y-4">
                {contact.email && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
                    <Text className="text-gray-900">{contact.email}</Text>
                  </View>
                )}

                {contact.phone && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Phone</Text>
                    <Text className="text-gray-900">{contact.phone}</Text>
                  </View>
                )}

                {contact.tags && contact.tags.length > 0 && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">Tags</Text>
                    <View className="flex-row flex-wrap">
                      {contact.tags.map((tag, index) => (
                        <View
                          key={index}
                          className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2"
                        >
                          <Text className="text-blue-800 text-sm">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">Created</Text>
                  <Text className="text-gray-900">
                    {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'Unknown'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
