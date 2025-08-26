import React, { useState } from 'react';
import { View, FlatList, ScrollView, Modal, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  ThemedView, 
  ThemedText, 
  ThemedButton, 
  ThemedCard,
  ThemedIcon
} from '../theme/components';

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

interface MessagesScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ visible, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sent' | 'received' | 'queued'>('all');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      contact_id: 'contact-1',
      contact_name: 'John Doe',
      contact_email: 'john.doe@example.com',
      step_id: 'step-1',
      step_name: 'Initial Contact',
      channel: 'email',
      subject: 'Hi John - Software Engineer Opportunity',
      body: 'Hi John,\n\nI noticed your work at Acme Corp and was impressed by your background in React and Node.js...',
      direction: 'sent',
      status: 'opened',
      sent_at: '2024-01-15T10:30:00Z',
      opened_at: '2024-01-15T14:22:00Z',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      contact_id: 'contact-1',
      contact_name: 'John Doe',
      contact_email: 'john.doe@example.com',
      channel: 'email',
      subject: 'Re: Software Engineer Opportunity',
      body: 'Hi there,\n\nThanks for reaching out! I am actually looking for new opportunities...',
      direction: 'received',
      status: 'replied',
      sent_at: '2024-01-16T09:15:00Z',
      replied_at: '2024-01-16T09:15:00Z',
      created_at: '2024-01-16T09:15:00Z',
    },
    {
      id: '3',
      contact_id: 'contact-2',
      contact_name: 'Jane Smith',
      contact_email: 'jane.smith@techstart.com',
      step_id: 'step-2',
      step_name: 'Follow-up',
      channel: 'email',
      subject: 'Following up - Software Engineer Role',
      body: 'Hi Jane,\n\nJust wanted to follow up on my previous message about the software engineer opportunity...',
      direction: 'sent',
      status: 'sent',
      sent_at: '2024-01-18T11:00:00Z',
      created_at: '2024-01-18T11:00:00Z',
    },
    {
      id: '4',
      contact_id: 'contact-3',
      contact_name: 'Mike Johnson',
      contact_email: 'mike@innovate.com',
      step_id: 'step-1',
      step_name: 'Thank You',
      channel: 'email',
      subject: 'Thank you for the interview',
      body: 'Hi Mike,\n\nThank you for taking the time to interview me yesterday...',
      direction: 'sent',
      status: 'queued',
      scheduled_at: '2024-01-20T10:00:00Z',
      created_at: '2024-01-19T15:30:00Z',
    },
    {
      id: '5',
      contact_id: 'contact-4',
      contact_name: 'Sarah Wilson',
      contact_email: 'sarah@startup.io',
      channel: 'linkedin',
      body: 'Hi Sarah, I\'d love to connect and discuss potential collaboration opportunities...',
      direction: 'sent',
      status: 'delivered',
      sent_at: '2024-01-17T16:45:00Z',
      created_at: '2024-01-17T16:45:00Z',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-yellow-500';
      case 'sent': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'opened': return 'bg-green-600';
      case 'replied': return 'bg-purple-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued': return 'time-outline';
      case 'sent': return 'checkmark-outline';
      case 'delivered': return 'checkmark-circle-outline';
      case 'opened': return 'eye-outline';
      case 'replied': return 'chatbubble-outline';
      case 'failed': return 'close-circle-outline';
      default: return 'help-outline';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return 'mail-outline';
      case 'linkedin': return 'logo-linkedin';
      case 'sms': return 'chatbubble-outline';
      default: return 'mail-outline';
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'sent' ? 'arrow-up' : 'arrow-down';
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'sent' ? 'text-blue-600' : 'text-green-600';
  };

  const filteredMessages = messages.filter(message => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'sent') return message.direction === 'sent';
    if (selectedFilter === 'received') return message.direction === 'received';
    if (selectedFilter === 'queued') return message.status === 'queued';
    return true;
  });

  const groupedMessages = filteredMessages.reduce((groups, message) => {
    const date = new Date(message.sent_at || message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  const renderMessage = ({ item }: { item: Message }) => (
    <ThemedCard variant="elevated" style={{ marginBottom: 12, padding: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <ThemedIcon 
              name={getDirectionIcon(item.direction) as any} 
              size={16} 
              style={{ 
                color: item.direction === 'sent' ? '#3b82f6' : '#10b981',
                marginRight: 4
              }} 
            />
            <ThemedText 
              size="sm" 
              weight="medium" 
              style={{ 
                color: item.direction === 'sent' ? '#3b82f6' : '#10b981'
              }}
            >
              {item.direction === 'sent' ? 'Sent' : 'Received'}
            </ThemedText>
            <View style={{ 
              marginLeft: 8, 
              paddingHorizontal: 8, 
              paddingVertical: 4, 
              borderRadius: 12, 
              backgroundColor: item.status === 'sent' ? '#3b82f6' : 
                             item.status === 'delivered' ? '#10b981' : 
                             item.status === 'opened' ? '#8b5cf6' : 
                             item.status === 'replied' ? '#f59e0b' : 
                             item.status === 'failed' ? '#ef4444' : '#6b7280'
            }}>
              <ThemedIcon name={getStatusIcon(item.status) as any} size={12} style={{ color: '#fff' }} />
            </View>
          </View>
          <ThemedText size="lg" weight="semibold" style={{ marginBottom: 4 }}>{item.contact_name}</ThemedText>
          <ThemedText variant="secondary" size="sm">{item.contact_email}</ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemedIcon name={getChannelIcon(item.channel) as any} size={20} style={{ color: '#6b7280', marginRight: 4 }} />
          <ThemedText variant="secondary" size="xs">
            {new Date(item.sent_at || item.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </ThemedText>
        </View>
      </View>

      {/* Subject */}
      {item.subject && (
        <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>{item.subject}</ThemedText>
      )}

      {/* Body Preview */}
      <ThemedText variant="secondary" size="sm" style={{ marginBottom: 12 }}>
        {item.body.length > 100 ? item.body.substring(0, 100) + '...' : item.body}
      </ThemedText>



      {/* Status Details */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemedIcon name={getStatusIcon(item.status) as any} size={16} style={{ color: '#6b7280', marginRight: 4 }} />
          <ThemedText variant="secondary" size="sm" style={{ textTransform: 'capitalize' }}>{item.status}</ThemedText>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {item.opened_at && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedIcon name="eye-outline" size={14} style={{ color: '#10b981', marginRight: 4 }} />
              <ThemedText size="xs" style={{ color: '#10b981' }}>Opened</ThemedText>
            </View>
          )}
          {item.replied_at && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedIcon name="chatbubble-outline" size={14} style={{ color: '#8b5cf6', marginRight: 4 }} />
              <ThemedText size="xs" style={{ color: '#8b5cf6' }}>Replied</ThemedText>
            </View>
          )}
        </View>
      </View>
    </ThemedCard>
  );

  const renderDateGroup = ({ item }: { item: { date: string; messages: Message[] } }) => (
    <View style={{ marginBottom: 24 }}>
      <ThemedText size="sm" weight="medium" variant="secondary" style={{ marginBottom: 12, paddingHorizontal: 16 }}>
        {new Date(item.date).toLocaleDateString([], { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </ThemedText>
      {item.messages.map(message => (
        <View key={message.id} style={{ paddingHorizontal: 16 }}>
          {renderMessage({ item: message })}
        </View>
      ))}
    </View>
  );

  const dateGroups = Object.entries(groupedMessages).map(([date, messages]) => ({
    date,
    messages,
  }));

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView variant="primary" style={{ flex: 1 }}>
        {/* Header */}
        <ThemedView variant="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
          <View>
            <ThemedText size="2xl" weight="bold">Messages</ThemedText>
            <ThemedText variant="secondary" size="sm" style={{ marginTop: 4 }}>
              All your communications
            </ThemedText>
          </View>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <ThemedIcon name="close" size={24} />
          </TouchableOpacity>
        </ThemedView>

        {/* Stats Overview */}
        <View style={{ flexDirection: 'row', padding: 20, gap: 12 }}>
          <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
            <ThemedText size="2xl" weight="bold">
              {messages.filter(m => m.direction === 'sent').length}
            </ThemedText>
            <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Sent</ThemedText>
          </ThemedCard>
          <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
            <ThemedText size="2xl" weight="bold">
              {messages.filter(m => m.direction === 'received').length}
            </ThemedText>
            <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Received</ThemedText>
          </ThemedCard>
          <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
            <ThemedText size="2xl" weight="bold">
              {messages.filter(m => m.status === 'replied').length}
            </ThemedText>
            <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Replies</ThemedText>
          </ThemedCard>
        </View>

        {/* Filters */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 0, gap: 8 }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'sent', label: 'Sent' },
            { key: 'received', label: 'Received' },
            { key: 'queued', label: 'Queued' },
          ].map(filter => (
            <ThemedButton
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              variant={selectedFilter === filter.key ? 'primary' : 'outline'}
              size="sm"
            >
              {filter.label}
            </ThemedButton>
          ))}
        </View>

        {/* Messages List */}
        <FlatList
          data={dateGroups}
          renderItem={renderDateGroup}
          keyExtractor={(item) => item.date}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </Modal>
  );
};
