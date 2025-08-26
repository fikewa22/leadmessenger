import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AITemplateModal } from '../components/AITemplateModal';
import { 
  ThemedView, 
  ThemedText, 
  ThemedButton, 
  ThemedCard,
  ThemedIcon,
  ThemedBadge
} from '../theme/components';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  channel: string;
  created_at: string;
  usage_count: number;
  category: string;
}

export const TemplatesScreen = () => {
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [showAIModal, setShowAIModal] = React.useState(false);

  // Enhanced mock data for job outreach
  React.useEffect(() => {
    setTemplates([
      {
        id: '1',
        name: 'Cold Outreach - Software Engineer',
        subject: 'Software Engineer Opportunity at {{company}}',
        body: 'Hi {{first_name}},\n\nI came across {{company}} and was impressed by your work on {{project}}. I\'m a software engineer with {{years}} years of experience in {{technologies}} and I believe I could contribute to your team.\n\nWould you be open to a brief conversation about potential opportunities?\n\nBest regards,\n{{my_name}}',
        channel: 'email',
        created_at: '2024-01-10',
        usage_count: 45,
        category: 'cold_outreach',
      },
      {
        id: '2',
        name: 'Follow-up After Application',
        subject: 'Following up on my application for {{position}}',
        body: 'Hi {{first_name}},\n\nI hope this email finds you well. I applied for the {{position}} role at {{company}} last week and wanted to follow up on my application.\n\nI\'m very excited about the opportunity and would love to discuss how my background in {{skills}} could benefit your team.\n\nThank you for your time.\n\nBest regards,\n{{my_name}}',
        channel: 'email',
        created_at: '2024-01-08',
        usage_count: 23,
        category: 'follow_up',
      },
      {
        id: '3',
        name: 'Networking Request',
        subject: 'Coffee chat request - {{industry}} professional',
        body: 'Hi {{first_name}},\n\nI\'m reaching out because I admire your work in {{industry}} and would love to learn from your experience. I\'m currently {{my_situation}} and would appreciate 15-20 minutes of your time for a coffee chat.\n\nWould you be available for a brief call this week?\n\nThanks,\n{{my_name}}',
        channel: 'email',
        created_at: '2024-01-05',
        usage_count: 12,
        category: 'networking',
      },
      {
        id: '4',
        name: 'Thank You After Interview',
        subject: 'Thank you - {{position}} interview',
        body: 'Hi {{first_name}},\n\nThank you for taking the time to interview me for the {{position}} role yesterday. I enjoyed learning more about {{company}} and the team.\n\nI\'m very excited about the opportunity and look forward to hearing about next steps.\n\nBest regards,\n{{my_name}}',
        channel: 'email',
        created_at: '2024-01-03',
        usage_count: 8,
        category: 'thank_you',
      },
    ]);
  }, []);

  const handleSaveAITemplate = (templateData: { name: string; subject: string; body: string; category: string }) => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateData.name,
      subject: templateData.subject,
      body: templateData.body,
      channel: 'email',
      created_at: new Date().toISOString().split('T')[0],
      usage_count: 0,
      category: templateData.category,
    };
    
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'mail-outline';
      case 'sms':
        return 'chatbubble-outline';
      case 'whatsapp':
        return 'phone-portrait-outline';
      default:
        return 'document-outline';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'bg-blue-500';
      case 'sms':
        return 'bg-green-500';
      case 'whatsapp':
        return 'bg-green-400';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cold_outreach':
        return 'bg-amber-500';
      case 'follow_up':
        return 'bg-blue-500';
      case 'networking':
        return 'bg-green-500';
      case 'thank_you':
        return 'bg-purple-500';
      case 'freelance':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderTemplate = ({ item }: { item: Template }) => (
    <ThemedCard variant="elevated" style={{ marginBottom: 16, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <ThemedText size="lg" weight="semibold" style={{ marginBottom: 4 }}>{item.name}</ThemedText>
          <ThemedText variant="secondary" size="sm">
            Created {new Date(item.created_at).toLocaleDateString()}
          </ThemedText>
        </View>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingHorizontal: 12, 
          paddingVertical: 4, 
          borderRadius: 16, 
          backgroundColor: item.channel === 'email' ? '#3b82f6' : '#10b981' 
        }}>
          <ThemedIcon name={getChannelIcon(item.channel) as any} size={16} style={{ color: '#fff', marginRight: 4 }} />
          <ThemedText size="xs" weight="medium" style={{ color: '#fff' }}>{item.channel.toUpperCase()}</ThemedText>
        </View>
      </View>

      <View style={{ marginBottom: 12 }}>
        <View style={{ 
          paddingHorizontal: 12, 
          paddingVertical: 4, 
          borderRadius: 16, 
          backgroundColor: item.category === 'cold_outreach' ? '#f59e0b' : 
                         item.category === 'follow_up' ? '#3b82f6' : 
                         item.category === 'networking' ? '#10b981' : 
                         item.category === 'thank_you' ? '#8b5cf6' : '#6b7280'
        }}>
          <ThemedText size="xs" weight="medium" style={{ color: '#fff' }}>
            {item.category.replace('_', ' ').toUpperCase()}
          </ThemedText>
        </View>
      </View>

      {item.subject && (
        <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>{item.subject}</ThemedText>
      )}
      
      <ThemedText variant="secondary" size="sm" style={{ marginBottom: 16 }}>
        {item.body.length > 150 ? item.body.substring(0, 150) + '...' : item.body}
      </ThemedText>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemedIcon name="analytics-outline" size={16} style={{ color: '#64748b', marginRight: 4 }} />
          <ThemedText variant="secondary" size="sm">{item.usage_count} times used</ThemedText>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <ThemedButton variant="outline" size="sm" onPress={() => {}}>
            Edit
          </ThemedButton>
          <ThemedButton size="sm" onPress={() => {}}>
            Use
          </ThemedButton>
        </View>
      </View>
    </ThemedCard>
  );

  return (
    <ThemedView variant="primary" style={{ flex: 1 }}>
      <ThemedView variant="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
        <View>
          <ThemedText size="xl" weight="bold">Email Templates</ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>
            {templates.length} templates for job outreach
          </ThemedText>
        </View>
        <ThemedButton
          onPress={() => setShowAIModal(true)}
          variant="secondary"
          size="sm"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedIcon name="sparkles" size={16} style={{ marginRight: 4 }} />
            <ThemedText size="sm" weight="semibold">AI Generate</ThemedText>
          </View>
        </ThemedButton>
      </ThemedView>

      <View style={{ flexDirection: 'row', padding: 20, gap: 12 }}>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">
            {templates.filter(t => t.category === 'cold_outreach').length}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Cold Outreach</ThemedText>
        </ThemedCard>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">
            {templates.filter(t => t.category === 'follow_up').length}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Follow-ups</ThemedText>
        </ThemedCard>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">
            {templates.filter(t => t.category === 'networking').length}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Networking</ThemedText>
        </ThemedCard>
      </View>

      <FlatList
        data={templates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      />

      {/* AI Template Generation Modal */}
      <AITemplateModal
        visible={showAIModal}
        onClose={() => setShowAIModal(false)}
        onSave={handleSaveAITemplate}
      />
    </ThemedView>
  );
};
