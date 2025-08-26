import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  ThemedView, 
  ThemedText, 
  ThemedButton, 
  ThemedInput, 
  ThemedCard,
  ThemedIcon
} from '../theme/components';
import { apiClient } from '../lib/api';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  position?: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

interface MessageComposerModalProps {
  visible: boolean;
  onClose: () => void;
  contacts: Contact[];
  templates: Template[];
  mode: 'individual' | 'mass';
  selectedContact?: Contact;
}

export const MessageComposerModal: React.FC<MessageComposerModalProps> = ({
  visible,
  onClose,
  contacts,
  templates,
  mode,
  selectedContact,
}) => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>(
    selectedContact ? [selectedContact] : []
  );
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleContactToggle = (contact: Contact) => {
    if (mode === 'individual') return;
    
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.id === contact.id);
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const selectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCustomSubject(template.subject);
    setCustomBody(template.body);
    setShowTemplateSelector(false);
  };

  const replaceTemplateVariables = (text: string, contact: Contact) => {
    return text
      .replace(/\{\{first_name\}\}/g, contact.first_name)
      .replace(/\{\{last_name\}\}/g, contact.last_name)
      .replace(/\{\{email\}\}/g, contact.email)
      .replace(/\{\{company\}\}/g, contact.company || '')
      .replace(/\{\{position\}\}/g, contact.position || '');
  };

  const handleSend = async () => {
    if (selectedContacts.length === 0) {
      Alert.alert('Error', 'Please select at least one contact');
      return;
    }

    if (!customSubject.trim() || !customBody.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    setIsSending(true);
    try {
      if (mode === 'individual' || selectedContacts.length === 1) {
        // Send single message
        const contact = selectedContacts[0];
        const personalizedSubject = replaceTemplateVariables(customSubject, contact);
        const personalizedBody = replaceTemplateVariables(customBody, contact);
        
        const result = await apiClient.sendMessage({
          contact_id: contact.id,
          channel: 'email',
          subject: personalizedSubject,
          body: personalizedBody,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        Alert.alert('Success', 'Message sent successfully!');
      } else {
        // Send bulk messages
        const messages = selectedContacts.map(contact => {
          const personalizedSubject = replaceTemplateVariables(customSubject, contact);
          const personalizedBody = replaceTemplateVariables(customBody, contact);
          
          return {
            contact_id: contact.id,
            channel: 'email',
            subject: personalizedSubject,
            body: personalizedBody,
          };
        });

        const result = await apiClient.sendBulkMessages(messages);

        if (result.error) {
          throw new Error(result.error);
        }

        Alert.alert(
          'Success', 
          `Messages sent to ${selectedContacts.length} contact${selectedContacts.length > 1 ? 's' : ''}!`
        );
      }
      
      handleClose();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send messages');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setSelectedContacts(selectedContact ? [selectedContact] : []);
    setSelectedTemplate(null);
    setCustomSubject('');
    setCustomBody('');
    setShowTemplateSelector(false);
    setIsSending(false);
    onClose();
  };

  const renderContact = ({ item }: { item: Contact }) => {
    const isSelected = selectedContacts.some(c => c.id === item.id);
    
    return (
      <TouchableOpacity
        onPress={() => handleContactToggle(item)}
        className={`p-4 rounded-lg border-2 mb-2 ${
          isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 bg-white'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">
              {item.first_name} {item.last_name}
            </Text>
            <Text className="text-gray-500 text-sm">{item.email}</Text>
            {item.company && (
              <Text className="text-gray-400 text-xs">{item.company}</Text>
            )}
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
          )}
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView variant="primary" style={{ flex: 1 }}>
        {/* Header */}
        <ThemedView variant="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
          <View>
            <ThemedText size="xl" weight="bold">
              {mode === 'individual' ? 'Send Message' : 'Mass Message'}
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={{ marginTop: 4 }}>
              {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
            </ThemedText>
          </View>
          <TouchableOpacity onPress={handleClose} style={{ padding: 8 }}>
            <ThemedIcon name="close" size={24} />
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Contact Selection */}
          {mode === 'mass' && (
            <View style={{ marginBottom: 24 }}>
              <ThemedText size="lg" weight="semibold" style={{ marginBottom: 16 }}>Select Contacts</ThemedText>
              <View>
                {contacts.map((contact) => (
                  <View key={contact.id}>
                    {renderContact({ item: contact })}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Template Selection */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText size="lg" weight="semibold" style={{ marginBottom: 16 }}>Email Template</ThemedText>
            
            {/* Template Dropdown */}
            <View style={{ marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setShowTemplateSelector(!showTemplateSelector)}
                style={{
                  backgroundColor: 'white',
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.1)',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <ThemedText style={{ color: selectedTemplate ? undefined : 'rgba(0,0,0,0.5)' }}>
                  {selectedTemplate ? selectedTemplate.name : "Choose a template..."}
                </ThemedText>
                <ThemedIcon 
                  name={showTemplateSelector ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  style={{ color: '#6b7280' }}
                />
              </TouchableOpacity>
              
              {/* Dropdown Options */}
              {showTemplateSelector && (
                <ThemedCard variant="elevated" style={{ marginTop: 4, maxHeight: 192 }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {templates.map((template) => (
                      <TouchableOpacity
                        key={template.id}
                        onPress={() => selectTemplate(template)}
                        style={{
                          padding: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: 'rgba(0,0,0,0.1)'
                        }}
                      >
                        <ThemedText size="sm" weight="medium" style={{ marginBottom: 4 }}>{template.name}</ThemedText>
                        <ThemedText variant="secondary" size="sm">{template.subject}</ThemedText>
                        <View style={{ marginTop: 8 }}>
                          <View style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            alignSelf: 'flex-start'
                          }}>
                            <ThemedText size="xs" style={{ color: '#3b82f6' }}>{template.category}</ThemedText>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </ThemedCard>
              )}
            </View>

            {selectedTemplate && (
              <ThemedCard variant="outlined" style={{ 
                padding: 16, 
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: '#3b82f6'
              }}>
                <ThemedText size="sm" weight="semibold" style={{ color: '#3b82f6', marginBottom: 4 }}>{selectedTemplate.name}</ThemedText>
                <ThemedText size="sm" style={{ color: '#3b82f6' }}>{selectedTemplate.subject}</ThemedText>
              </ThemedCard>
            )}
          </View>

          {/* Message Composition */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText size="lg" weight="semibold" style={{ marginBottom: 16 }}>Message</ThemedText>
            
            <View style={{ marginBottom: 16 }}>
              <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Subject</ThemedText>
              <ThemedInput
                value={customSubject}
                onChangeText={setCustomSubject}
                placeholder="Enter subject line..."
                style={{ padding: 16, borderRadius: 12 }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Message Body</ThemedText>
              <ThemedInput
                value={customBody}
                onChangeText={setCustomBody}
                placeholder="Enter your message..."
                multiline
                numberOfLines={8}
                style={{ padding: 16, borderRadius: 12, minHeight: 120, textAlignVertical: 'top' }}
              />
            </View>

            {/* Variable Help */}
            <ThemedCard variant="outlined" style={{ padding: 12 }}>
              <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Available Variables:</ThemedText>
              <ThemedText variant="secondary" size="xs">
                {'{{first_name}}'} {'{{last_name}}'} {'{{email}}'} {'{{company}}'} {'{{position}}'}
              </ThemedText>
            </ThemedCard>
          </View>

          {/* Preview */}
          {selectedContacts.length > 0 && (customSubject || customBody) && (
            <View style={{ marginBottom: 24 }}>
              <ThemedText size="lg" weight="semibold" style={{ marginBottom: 16 }}>Preview</ThemedText>
              <ThemedCard variant="elevated" style={{ padding: 16 }}>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>
                  To: {selectedContacts.map(c => c.email).join(', ')}
                </ThemedText>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>
                  Subject: {customSubject}
                </ThemedText>
                <ThemedText variant="secondary" size="sm" style={{ numberOfLines: 4 }}>
                  {customBody}
                </ThemedText>
              </ThemedCard>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <ThemedView variant="card" style={{ padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' }}>
          <ThemedButton
            onPress={handleSend}
            disabled={isSending || selectedContacts.length === 0}
            size="lg"
          >
            {isSending ? (
              <ThemedText weight="semibold">Sending...</ThemedText>
            ) : (
              <ThemedText weight="semibold">
                Send to {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''}
              </ThemedText>
            )}
          </ThemedButton>
        </ThemedView>

      </ThemedView>
    </Modal>
  );
};
