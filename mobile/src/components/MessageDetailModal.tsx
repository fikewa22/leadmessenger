import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  contact_id: string;
  contact_name: string;
  contact_email: string;

  step_id?: string;
  step_name?: string;
  channel: 'email' | 'linkedin' | 'sms';
  subject?: string;
  body: string;
  direction: 'sent' | 'received';
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'replied' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
  opened_at?: string;
  replied_at?: string;
  created_at: string;
}

interface MessageDetailModalProps {
  visible: boolean;
  onClose: () => void;
  messages: Message[];
  contactName: string;
  contactEmail: string;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  visible,
  onClose,
  messages,
  contactName,
  contactEmail,
}) => {
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Reply sent successfully!');
      setReplyText('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = (message: Message, index: number) => (
    <View
      key={message.id}
      className={`mb-4 ${
        message.direction === 'sent' ? 'items-end' : 'items-start'
      }`}
    >
      <View
        className={`max-w-[80%] p-4 rounded-2xl ${
          message.direction === 'sent'
            ? 'bg-blue-500'
            : 'bg-gray-100'
        }`}
      >
        {/* Message Header */}
        <View className="flex-row justify-between items-center mb-2">
          <Text
            className={`text-xs ${
              message.direction === 'sent' ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {message.direction === 'sent' ? 'You' : contactName}
          </Text>
          <Text
            className={`text-xs ${
              message.direction === 'sent' ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {new Date(message.sent_at || message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Subject */}
        {message.subject && (
          <Text
            className={`font-medium mb-2 ${
              message.direction === 'sent' ? 'text-white' : 'text-gray-800'
            }`}
          >
            {message.subject}
          </Text>
        )}

        {/* Message Body */}
        <Text
          className={`${
            message.direction === 'sent' ? 'text-white' : 'text-gray-800'
          }`}
        >
          {message.body}
        </Text>

        {/* Status Indicators */}
        <View className="flex-row items-center mt-2 space-x-2">
          {message.direction === 'sent' && (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color="rgba(255,255,255,0.7)"
              />
              {message.opened_at && (
                <Ionicons
                  name="eye-outline"
                  size={14}
                  color="rgba(255,255,255,0.7)"
                />
              )}
            </>
          )}
        </View>


      </View>
    </View>
  );

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.sent_at || a.created_at).getTime() - new Date(b.sent_at || b.created_at).getTime()
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row justify-between items-center p-5 bg-white border-b border-gray-200">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">{contactName}</Text>
            <Text className="text-sm text-gray-500">{contactEmail}</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView className="flex-1 p-4">
          {sortedMessages.map((message, index) => renderMessage(message, index))}
        </ScrollView>

        {/* Reply Input */}
        <View className="p-4 bg-white border-t border-gray-200">
          <View className="flex-row items-end space-x-3">
            <View className="flex-1">
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Type your reply..."
                multiline
                numberOfLines={3}
                className="bg-gray-100 p-3 rounded-xl text-gray-800"
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity
              onPress={handleSendReply}
              disabled={isSending || !replyText.trim()}
              className={`p-3 rounded-xl ${
                isSending || !replyText.trim() ? 'bg-gray-300' : 'bg-blue-500'
              }`}
            >
              {isSending ? (
                <Ionicons name="hourglass-outline" size={20} color="#6b7280" />
              ) : (
                <Ionicons name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
