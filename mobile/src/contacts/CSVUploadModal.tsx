import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { contactsAPI } from '../api/client';

interface CSVUploadModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({
  visible,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentResult | null>(null);

  const importContactsMutation = useMutation({
    mutationFn: (file: any) => contactsAPI.importContacts(file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      Alert.alert('Success', response.data.message || 'Contacts imported successfully!');
      handleClose();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to import contacts');
    },
  });

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || selectedFile.canceled || !selectedFile.assets[0]) {
      Alert.alert('Error', 'Please select a CSV file first');
      return;
    }

    const file = selectedFile.assets[0];
    
    // Create a file object that can be sent to the API
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: 'text/csv',
      name: file.name,
    } as any);

    importContactsMutation.mutate(formData);
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
          <Text className="text-xl font-semibold text-gray-900">Import Contacts</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text className="text-gray-500 text-lg">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Instructions */}
          <View className="bg-blue-50 p-4 rounded-lg mb-6">
            <Text className="text-blue-900 font-semibold mb-2">CSV Format Requirements:</Text>
            <Text className="text-blue-800 text-sm mb-1">• First row should contain headers</Text>
            <Text className="text-blue-800 text-sm mb-1">• Supported columns: email, phone, first_name, last_name, company, position, linkedin, tags, status, source</Text>
            <Text className="text-blue-800 text-sm mb-1">• Tags should be comma-separated</Text>
            <Text className="text-blue-800 text-sm">• All fields are optional except at least one identifier (name, email, or phone)</Text>
          </View>

          {/* File Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Select CSV File</Text>
            
            {selectedFile && !selectedFile.canceled && selectedFile.assets[0] ? (
              <View className="bg-green-50 p-4 rounded-lg border border-green-200">
                <Text className="text-green-900 font-medium mb-1">Selected File:</Text>
                <Text className="text-green-800">{selectedFile.assets[0].name}</Text>
                <Text className="text-green-700 text-sm mt-1">
                  Size: {(selectedFile.assets[0].size / 1024).toFixed(1)} KB
                </Text>
              </View>
            ) : (
              <View className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <Text className="text-gray-500 text-center mb-4">No file selected</Text>
                <TouchableOpacity
                  className="bg-primary-600 px-6 py-3 rounded-lg self-center"
                  onPress={pickDocument}
                >
                  <Text className="text-white font-semibold">Choose CSV File</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Sample CSV */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Sample CSV Format</Text>
            <View className="bg-gray-100 p-4 rounded-lg">
              <Text className="text-gray-800 text-sm font-mono">
                                  email,first_name,last_name,phone,company,position,linkedin,tags,status,source{'\n'}
                  john@example.com,John,Doe,+1234567890,Acme Corp,Software Engineer,linkedin.com/johndoe,"lead,customer",prospect,LinkedIn{'\n'}
                  jane@example.com,Jane,Smith,+1987654321,Tech Inc,Product Manager,linkedin.com/janesmith,"customer",contacted,Referral{'\n'}
                  mike@example.com,Mike,Johnson,,Startup LLC,CTO,linkedin.com/mikejohnson,"prospect,hot",prospect,Cold Outreach
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            className={`rounded-lg py-3 mb-3 ${
              !selectedFile || selectedFile.canceled || importContactsMutation.isPending
                ? 'bg-gray-400'
                : 'bg-primary-600'
            }`}
            onPress={handleUpload}
            disabled={!selectedFile || selectedFile.canceled || importContactsMutation.isPending}
          >
            {importContactsMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">Import Contacts</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-gray-200 px-6 py-3 rounded-lg"
            onPress={pickDocument}
            disabled={importContactsMutation.isPending}
          >
            <Text className="text-gray-700 text-center font-semibold">Choose Different File</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
