import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
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

interface ContactListProps {
  contacts: Contact[];
  onContactPress?: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onContactPress,
}) => {
  const queryClient = useQueryClient();

  const deleteContactMutation = useMutation({
    mutationFn: (contactId: string) => contactsAPI.deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to delete contact');
    },
  });

  const handleDeleteContact = (contact: Contact) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.first_name || contact.email || 'this contact'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteContactMutation.mutate(contact.id),
        },
      ]
    );
  };

  const getDisplayName = (contact: Contact) => {
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

  const getContactInfo = (contact: Contact) => {
    const info = [];
    if (contact.email) info.push(contact.email);
    if (contact.phone) info.push(contact.phone);
    if (contact.company) info.push(contact.company);
    return info.join(' • ');
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      className="bg-white border border-gray-200 rounded-lg p-4 mb-3"
      onPress={() => onContactPress?.(item)}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {getDisplayName(item)}
          </Text>
          
          {getContactInfo(item) && (
            <Text className="text-gray-600 text-sm mb-2">
              {getContactInfo(item)}
            </Text>
          )}
          
          {item.tags && item.tags.length > 0 && (
            <View className="flex-row flex-wrap mb-2">
              {item.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-1"
                >
                  <Text className="text-blue-800 text-xs">{tag}</Text>
                </View>
              ))}
              {item.tags.length > 3 && (
                <View className="bg-gray-100 px-2 py-1 rounded-full">
                  <Text className="text-gray-600 text-xs">
                    +{item.tags.length - 3} more
                  </Text>
                </View>
              )}
            </View>
          )}
          
        </View>
        
        <TouchableOpacity
          className="ml-2 p-2"
          onPress={() => handleDeleteContact(item)}
          disabled={deleteContactMutation.isPending}
        >
          <Text className="text-red-500 text-lg">🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (contacts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Text className="text-gray-600 text-lg mb-4">No contacts yet</Text>
        <Text className="text-gray-500 text-center px-8">
          Start by adding your first contact or importing from a CSV file
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={contacts}
      renderItem={renderContact}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};
