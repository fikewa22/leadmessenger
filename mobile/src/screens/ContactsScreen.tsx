import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, Modal, ScrollView, ActivityIndicator, TouchableOpacity, Text, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { MessageComposerModal } from '../components/MessageComposerModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { 
  ThemedView, 
  ThemedText, 
  ThemedButton, 
  ThemedInput, 
  ThemedCard,
  ThemedIcon,
  ThemedModal,
  ThemedBadge
} from '../theme/components';

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

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

export const ContactsScreen = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToMessage, setContactToMessage] = useState<Contact | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [messageMode, setMessageMode] = useState<'individual' | 'mass'>('individual');
  const [selectedContactsForMessage, setSelectedContactsForMessage] = useState<Contact[]>([]);
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company: '',
    position: '',
    phone: '',
    linkedin: '',
    tags: [] as string[],
    status: '',
    source: '',
  });

  // Mock templates data
  const templates: Template[] = [
      {
        id: '1',
      name: 'Cold Outreach',
      subject: 'Hi {{first_name}} - Software Engineer Opportunity',
      body: 'Hi {{first_name}},\n\nI noticed your work at {{company}} and was impressed by your background. I\'m reaching out because we have an exciting software engineer opportunity that I think would be a great fit for your skills.\n\nWould you be interested in learning more?\n\nBest regards,\n[Your Name]',
      category: 'cold_outreach',
      },
      {
        id: '2',
      name: 'Follow-up',
      subject: 'Following up - {{company}} Opportunity',
      body: 'Hi {{first_name}},\n\nJust wanted to follow up on my previous message about the opportunity at {{company}}. I\'d love to schedule a quick call to discuss this further.\n\nLet me know if you\'re still interested!\n\nBest regards,\n[Your Name]',
      category: 'follow_up',
      },
      {
        id: '3',
      name: 'Networking Request',
      subject: 'Connecting - {{company}}',
      body: 'Hi {{first_name}},\n\nI came across your profile and was impressed by your work at {{company}}. I\'d love to connect and learn more about your experience in the industry.\n\nWould you be open to a brief coffee chat?\n\nBest regards,\n[Your Name]',
      category: 'networking',
    },
  ];

  // Fetch contacts from API
  const { data: contactsResponse, isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await apiClient.getContacts();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || { contacts: [], total: 0, page: 1, per_page: 20 };
    },
  });

  const contacts = (contactsResponse as any)?.contacts || [];

  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: (contactData: any) => apiClient.createContact(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      Alert.alert('Success', 'Contact created successfully!');
      setShowAddModal(false);
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
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to create contact');
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: (contactId: string) => apiClient.deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      Alert.alert('Success', 'Contact deleted successfully!');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to delete contact');
    },
  });

  const handleContactPress = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseContactDetail = () => {
    setSelectedContact(null);
  };

  const handleMessageContact = (contact: Contact) => {
    setContactToMessage(contact);
    setMessageMode('individual');
    setShowMessageComposer(true);
  };

  const handleMassMessage = () => {
    setMessageMode('mass');
    setShowMessageComposer(true);
  };

  const handleCloseMessageComposer = () => {
    setShowMessageComposer(false);
    setContactToMessage(null);
  };

  const updateFormData = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const parseCSV = (csvText: string): Contact[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const contacts: Contact[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const contact: any = {
        id: Date.now().toString() + i,
        created_at: new Date().toISOString(),
      };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'email':
            contact.email = value || undefined;
            break;
          case 'phone':
            contact.phone = value || undefined;
            break;
          case 'first_name':
            contact.first_name = value || undefined;
            break;
          case 'last_name':
            contact.last_name = value || undefined;
            break;
          case 'company':
            contact.company = value || undefined;
            break;
          case 'position':
            contact.position = value || undefined;
            break;
          case 'linkedin':
            contact.linkedin = value || undefined;
            break;
          case 'tags':
            contact.tags = value ? value.split(',').map((tag: string) => tag.trim()) : [];
            break;
          case 'status':
            contact.status = value || undefined;
            break;
          case 'source':
            contact.source = value || undefined;
            break;
        }
      });

      // Validate that required fields are present
      if (!contact.email || !contact.first_name || !contact.last_name) {
        continue; // Skip invalid rows
      }

      contacts.push(contact);
    }

    return contacts;
  };

  const handleImportContacts = async () => {
    if (!selectedFile || selectedFile.canceled || !selectedFile.assets[0]) {
      Alert.alert('Error', 'Please select a CSV file first');
      return;
    }

    setIsImporting(true);
    try {
      const file = selectedFile.assets[0];
      
      // Read the file content
      const response = await fetch(file.uri);
      const csvText = await response.text();
      
      // Parse the CSV
      const importedContacts = parseCSV(csvText);
      
      if (importedContacts.length === 0) {
        Alert.alert('Error', 'No valid contacts found in the CSV file');
        return;
      }

      // Import contacts via API
      for (const contact of importedContacts) {
        await apiClient.createContact(contact);
      }
      
      // Refresh contacts list
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      
      Alert.alert('Success', `Successfully imported ${importedContacts.length} contacts!`);
      setSelectedFile(null);
      setShowCSVModal(false);
      
    } catch (error) {
      Alert.alert('Error', `Failed to import contacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    deleteContactMutation.mutate(contactId);
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

  const handleSubmitContact = () => {
    if (!formData.email || !formData.first_name || !formData.last_name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const contactData = {
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      company: formData.company || undefined,
      position: formData.position || undefined,
      phone: formData.phone || undefined,
      linkedin: formData.linkedin || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      status: formData.status || undefined,
      source: formData.source || undefined,
    };

    createContactMutation.mutate(contactData);
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity onPress={() => handleContactPress(item)}>
      <ThemedCard 
        variant="elevated" 
        style={{ marginBottom: 12, padding: 16 }}
      >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <ThemedText size="lg" weight="semibold" style={{ marginBottom: 4 }}>
            {getDisplayName(item)}
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={{ marginBottom: 4 }}>{item.email}</ThemedText>
          {item.company && (
            <ThemedText size="sm" style={{ marginBottom: 2 }}>{item.company}</ThemedText>
          )}
          {item.position && (
            <ThemedText variant="secondary" size="sm">{item.position}</ThemedText>
          )}
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ThemedButton
            onPress={() => handleMessageContact(item)}
            variant="ghost"
            size="sm"
            style={{ padding: 8, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          >
            <ThemedIcon name="mail-outline" size={20} style={{ color: '#3b82f6' }} />
          </ThemedButton>
          <ThemedButton
            onPress={() => handleDeleteContact(item.id)}
            variant="ghost"
            size="sm"
            style={{ padding: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            <ThemedIcon name="trash-outline" size={20} style={{ color: '#ef4444' }} />
          </ThemedButton>
        </View>
      </View>
      
              {item.tags && item.tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
            {item.tags.map((tag, index) => (
              <View
                key={index}
                style={{ 
                  marginRight: 8, 
                  marginBottom: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }}
              >
                <ThemedText size="xs">{tag}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </ThemedCard>
    </TouchableOpacity>
  );

    return (
    <ThemedView variant="primary" style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView variant="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
        <View>
          <ThemedText size="2xl" weight="bold">Contacts</ThemedText>
          <ThemedText variant="secondary" size="sm" style={{ marginTop: 4 }}>
            {contacts.length} contacts for job outreach
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <ThemedButton
            onPress={handleMassMessage}
            variant="secondary"
            size="sm"
          >
            Mass Message
          </ThemedButton>
          <ThemedButton
            onPress={() => setShowAddModal(true)}
            size="sm"
          >
            + Add
          </ThemedButton>
        </View>
      </ThemedView>

      {/* Stats Overview */}
      <View style={{ flexDirection: 'row', padding: 20, gap: 12 }}>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">{contacts.length}</ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Total</ThemedText>
        </ThemedCard>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">
            {contacts.filter((c: Contact) => c.status === 'prospect').length}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Prospects</ThemedText>
        </ThemedCard>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">
            {contacts.filter((c: Contact) => c.status === 'contacted').length}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Contacted</ThemedText>
        </ThemedCard>
      </View>

      {/* Import Button */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <ThemedButton
          onPress={() => setShowCSVModal(true)}
          variant="outline"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e' }}
        >
          <ThemedText style={{ color: '#22c55e' }} weight="semibold">
            📁 Import Contacts from CSV
          </ThemedText>
        </ThemedButton>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <ThemedText variant="secondary" style={{ marginTop: 8 }}>Loading contacts...</ThemedText>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <ThemedText style={{ textAlign: 'center', marginBottom: 16, color: '#ef4444' }}>
            Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
          </ThemedText>
          <ThemedButton
            onPress={() => queryClient.invalidateQueries({ queryKey: ['contacts'] })}
            size="sm"
          >
            Retry
          </ThemedButton>
        </View>
      )}

      {/* Contacts List */}
      {!isLoading && !error && (
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Contact Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <ThemedView variant="primary" style={{ flex: 1 }}>
          {/* Header */}
          <ThemedView variant="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
            <ThemedText size="xl" weight="semibold">Add New Contact</ThemedText>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <ThemedIcon name="close" size={24} />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* Form Fields */}
            <View style={{ gap: 16 }}>
              {/* Name Fields */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>First Name</ThemedText>
                  <ThemedInput
                    value={formData.first_name}
                    onChangeText={(value) => updateFormData('first_name', value)}
                    placeholder="First name"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Last Name</ThemedText>
                  <ThemedInput
                    value={formData.last_name}
                    onChangeText={(value) => updateFormData('last_name', value)}
                    placeholder="Last name"
                  />
                </View>
              </View>

              {/* Email */}
              <View>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Email</ThemedText>
                <ThemedInput
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder="email@example.com"
                  keyboardType="email-address"
                />
              </View>

              {/* Phone */}
              <View>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Phone</ThemedText>
                <ThemedInput
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  placeholder="+1 (555) 123-4567"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Company */}
              <View>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Company</ThemedText>
                <ThemedInput
                  value={formData.company}
                  onChangeText={(value) => updateFormData('company', value)}
                  placeholder="Company name"
                />
              </View>

              {/* Position */}
              <View>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Position</ThemedText>
                <ThemedInput
                  value={formData.position}
                  onChangeText={(value) => updateFormData('position', value)}
                  placeholder="Position"
                />
              </View>

              {/* LinkedIn */}
              <View>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>LinkedIn</ThemedText>
                <ThemedInput
                  value={formData.linkedin}
                  onChangeText={(value) => updateFormData('linkedin', value)}
                  placeholder="LinkedIn Profile URL"
                />
              </View>

              {/* Tags */}
              <View>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Tags (comma-separated)</ThemedText>
                <ThemedInput
                  value={formData.tags.join(', ')}
                  onChangeText={(value) => updateFormData('tags', value.split(',').map(tag => tag.trim()))}
                  placeholder="e.g., investor, lead"
                />
                <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>
                  Separate multiple tags with commas
                </ThemedText>
              </View>

              {/* Status */}
              <View>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Status</ThemedText>
                <ThemedInput
                  value={formData.status}
                  onChangeText={(value) => updateFormData('status', value)}
                  placeholder="e.g., prospect, contacted"
                />
              </View>

              {/* Source */}
              <View>
                <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Source</ThemedText>
                <ThemedInput
                  value={formData.source}
                  onChangeText={(value) => updateFormData('source', value)}
                  placeholder="e.g., LinkedIn, Referral"
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <ThemedView variant="card" style={{ padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' }}>
            <ThemedButton onPress={handleSubmitContact} size="lg" loading={createContactMutation.isPending}>
              Add Contact
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* CSV Upload Modal */}
      <Modal
        visible={showCSVModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCSVModal(false)}
      >
        <ThemedView variant="primary" style={{ flex: 1 }}>
          {/* Header */}
          <ThemedView variant="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
            <ThemedText size="xl" weight="semibold">Import Contacts</ThemedText>
            <TouchableOpacity onPress={() => setShowCSVModal(false)}>
              <ThemedIcon name="close" size={24} />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* Instructions */}
            <ThemedCard variant="outlined" style={{ padding: 16, marginBottom: 24, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6' }}>
              <ThemedText size="sm" weight="semibold" style={{ color: '#3b82f6', marginBottom: 8 }}>CSV Format Requirements:</ThemedText>
              <ThemedText size="xs" style={{ color: '#3b82f6', marginBottom: 4 }}>• First row should contain headers</ThemedText>
              <ThemedText size="xs" style={{ color: '#3b82f6', marginBottom: 4 }}>• Supported columns: email, phone, first_name, last_name, company, position, linkedin, tags, status, source</ThemedText>
              <ThemedText size="xs" style={{ color: '#3b82f6', marginBottom: 4 }}>• Tags should be comma-separated</ThemedText>
              <ThemedText size="xs" style={{ color: '#3b82f6' }}>• All fields are optional except at least one identifier (name, email, or phone)</ThemedText>
            </ThemedCard>

            {/* File Selection */}
            <View style={{ marginBottom: 24 }}>
              <ThemedText size="lg" weight="semibold" style={{ marginBottom: 16 }}>Select CSV File</ThemedText>
              
              {selectedFile && !selectedFile.canceled && selectedFile.assets[0] ? (
                <ThemedCard variant="outlined" style={{ padding: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                  <ThemedText size="sm" weight="medium" style={{ color: '#10b981', marginBottom: 4 }}>Selected File:</ThemedText>
                  <ThemedText size="sm" style={{ color: '#10b981' }}>{selectedFile.assets[0].name}</ThemedText>
                  <ThemedText size="xs" style={{ color: '#10b981', marginTop: 4 }}>
                    Size: {(selectedFile.assets[0].size / 1024).toFixed(1)} KB
                  </ThemedText>
                </ThemedCard>
              ) : (
                <ThemedCard variant="outlined" style={{ padding: 32, borderStyle: 'dashed', alignItems: 'center' }}>
                  <ThemedText variant="secondary" style={{ marginBottom: 16, textAlign: 'center' }}>No file selected</ThemedText>
                  <ThemedButton onPress={pickDocument} variant="outline">
                    Choose CSV File
                  </ThemedButton>
                </ThemedCard>
              )}
            </View>

            {/* Sample CSV */}
            <View style={{ marginBottom: 24 }}>
              <ThemedText size="lg" weight="semibold" style={{ marginBottom: 16 }}>Sample CSV Format</ThemedText>
              <ThemedCard variant="elevated" style={{ padding: 16 }}>
                <ThemedText variant="secondary" size="sm" style={{ fontFamily: 'monospace' }}>
                  email,first_name,last_name,phone,company,position,linkedin,tags,status,source{'\n'}
                  john@example.com,John,Doe,+1234567890,Acme Corp,Software Engineer,linkedin.com/johndoe,"lead,customer",prospect,LinkedIn{'\n'}
                  jane@example.com,Jane,Smith,+1987654321,Tech Inc,Product Manager,linkedin.com/janesmith,"customer",contacted,Referral{'\n'}
                  mike@example.com,Mike,Johnson,,Startup LLC,CTO,linkedin.com/mikejohnson,"prospect,hot",prospect,Cold Outreach
                </ThemedText>
              </ThemedCard>
            </View>
          </ScrollView>

          {/* Footer */}
          <ThemedView variant="card" style={{ padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' }}>
            <ThemedButton
              onPress={handleImportContacts}
              disabled={!selectedFile || selectedFile.canceled || isImporting}
              size="lg"
              loading={isImporting}
            >
              {isImporting ? 'Importing...' : 'Import Contacts'}
            </ThemedButton>
            
            <ThemedButton
              onPress={pickDocument}
              disabled={isImporting}
              variant="outline"
              style={{ marginTop: 8 }}
            >
              Choose Different File
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCloseContactDetail}
        >
          <ThemedView variant="primary" style={{ flex: 1 }}>
            {/* Header */}
            <ThemedView variant="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
              <ThemedText size="xl" weight="semibold">Contact Details</ThemedText>
              <TouchableOpacity onPress={handleCloseContactDetail}>
                <ThemedIcon name="close" size={24} />
              </TouchableOpacity>
            </ThemedView>
          <ScrollView style={{ flex: 1, padding: 16 }}>
            <View style={{ gap: 24 }}>
              <ThemedCard variant="elevated" style={{ padding: 16 }}>
                <ThemedText size="2xl" weight="bold" style={{ marginBottom: 8 }}>
                  {getDisplayName(selectedContact)}
                </ThemedText>
                {selectedContact.company && (
                  <ThemedText size="lg">{selectedContact.company}</ThemedText>
                )}
              </ThemedCard>

              <View style={{ gap: 16 }}>
                {selectedContact.email && (
                  <View>
                    <ThemedText size="sm" weight="medium" style={{ marginBottom: 4 }}>Email</ThemedText>
                    <ThemedText>{selectedContact.email}</ThemedText>
                  </View>
                )}

                {selectedContact.phone && (
                  <View>
                    <ThemedText size="sm" weight="medium" style={{ marginBottom: 4 }}>Phone</ThemedText>
                    <ThemedText>{selectedContact.phone}</ThemedText>
                  </View>
                )}

                {selectedContact.tags && selectedContact.tags.length > 0 && (
                  <View>
                    <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>Tags</ThemedText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {selectedContact.tags.map((tag, index) => (
                        <View
                          key={index}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 16,
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            marginRight: 8,
                            marginBottom: 8
                          }}
                        >
                          <ThemedText size="sm" style={{ color: '#3b82f6' }}>{tag}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View>
                  <ThemedText size="sm" weight="medium" style={{ marginBottom: 4 }}>Created</ThemedText>
                  <ThemedText>
                    {selectedContact.created_at ? new Date(selectedContact.created_at).toLocaleDateString() : 'Unknown'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' }}>
            <ThemedButton
              onPress={() => {
                const contact = selectedContact; // Store the contact before closing
                handleCloseContactDetail();
                handleMessageContact(contact);
              }}
              size="lg"
            >
              Send Message
            </ThemedButton>
          </View>
        </ThemedView>
      </Modal>
      )}

      {/* Message Composer Modal */}
      <MessageComposerModal
        visible={showMessageComposer}
        onClose={handleCloseMessageComposer}
        contacts={contacts}
        templates={templates}
        mode={messageMode}
        selectedContact={contactToMessage || undefined}
      />

    </ThemedView>
  );
};
