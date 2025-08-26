import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OpenRouterService, OPENROUTER_MODELS, OpenRouterModel } from '../services/openrouter';
import { ENV } from '../config/env';

interface AITemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (template: { name: string; subject: string; body: string; category: string }) => void;
}

const TEMPLATE_CATEGORIES = [
  { id: 'cold_outreach', name: 'Cold Outreach', icon: 'rocket-outline' },
  { id: 'follow_up', name: 'Follow-up', icon: 'refresh-outline' },
  { id: 'networking', name: 'Networking', icon: 'people-outline' },
  { id: 'thank_you', name: 'Thank You', icon: 'heart-outline' },
  { id: 'freelance', name: 'Freelance', icon: 'briefcase-outline' },
];

const TEMPLATE_PROMPTS = {
  cold_outreach: 'Create a professional cold outreach email template for job applications. Include placeholders like {{first_name}}, {{company}}, {{position}}, {{my_name}}, {{years}}, {{technologies}}. Keep it concise and engaging.',
  follow_up: 'Create a follow-up email template after submitting a job application. Include placeholders like {{first_name}}, {{company}}, {{position}}, {{my_name}}, {{skills}}. Be polite and professional.',
  networking: 'Create a networking email template to connect with professionals. Include placeholders like {{first_name}}, {{industry}}, {{my_situation}}, {{my_name}}. Be genuine and respectful.',
  thank_you: 'Create a thank you email template after an interview. Include placeholders like {{first_name}}, {{company}}, {{position}}, {{my_name}}. Show enthusiasm and gratitude.',
  freelance: 'Create a freelance proposal email template. Include placeholders like {{first_name}}, {{project}}, {{my_name}}, {{skills}}, {{portfolio}}. Be professional and highlight value.',
};

export const AITemplateModal: React.FC<AITemplateModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('cold_outreach');
  const [selectedModel, setSelectedModel] = useState<OpenRouterModel>('gpt-oss-20b');
  const [customPrompt, setCustomPrompt] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSubject, setIsGeneratingSubject] = useState(false);

  // Initialize OpenRouter service with API key from environment
  const openRouterService = new OpenRouterService(ENV.OPENROUTER_API_KEY);

  const handleGenerateTemplate = async () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    if (!ENV.OPENROUTER_API_KEY) {
      Alert.alert('Error', 'OpenRouter API key not configured. Please add EXPO_PUBLIC_OPENROUTER_API_KEY to your environment variables.');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = customPrompt.trim() || TEMPLATE_PROMPTS[selectedCategory as keyof typeof TEMPLATE_PROMPTS];
      const model = OPENROUTER_MODELS[selectedModel];
      
      const generatedTemplate = await openRouterService.generateTemplate(prompt, model);
      setGeneratedBody(generatedTemplate);
      
      // Generate subject line
      setIsGeneratingSubject(true);
      const subject = await openRouterService.generateSubjectLine(generatedTemplate, model);
      setGeneratedSubject(subject);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate template. Please check your API key and try again.');
      console.error('Template generation error:', error);
    } finally {
      setIsGenerating(false);
      setIsGeneratingSubject(false);
    }
  };

  const handleSave = () => {
    if (!templateName.trim() || !generatedBody.trim()) {
      Alert.alert('Error', 'Please generate a template first');
      return;
    }

    onSave({
      name: templateName,
      subject: generatedSubject,
      body: generatedBody,
      category: selectedCategory,
    });
    handleClose();
  };

  const handleClose = () => {
    setTemplateName('');
    setGeneratedSubject('');
    setGeneratedBody('');
    setCustomPrompt('');
    setSelectedCategory('cold_outreach');
    setSelectedModel('gpt-oss-20b');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row justify-between items-center p-5 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">AI Template Generator</Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-5">
          {/* API Key Warning */}
          {!ENV.OPENROUTER_API_KEY && (
            <View className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <View className="flex-row items-center mb-2">
                <Ionicons name="warning" size={20} color="#d97706" />
                <Text className="text-yellow-800 font-medium ml-2">API Key Required</Text>
              </View>
              <Text className="text-yellow-700 text-sm">
                Add your OpenRouter API key to EXPO_PUBLIC_OPENROUTER_API_KEY in your .env file to use AI template generation.
              </Text>
            </View>
          )}

          {/* Template Name */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Template Name</Text>
            <TextInput
              value={templateName}
              onChangeText={setTemplateName}
              placeholder="Enter template name"
              placeholderTextColor="#9ca3af"
              className="bg-white p-4 rounded-xl border border-gray-200"
              style={{ color: '#1f2937' }}
            />
          </View>

          {/* Category Selection */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {TEMPLATE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`flex-row items-center px-4 py-2 rounded-full border ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Ionicons
                    name={category.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={selectedCategory === category.id ? '#ffffff' : '#6b7280'}
                  />
                  <Text
                    className={`ml-2 text-sm font-medium ${
                      selectedCategory === category.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Model Selection */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">AI Model (Free)</Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.entries(OPENROUTER_MODELS).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setSelectedModel(key as OpenRouterModel)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedModel === key
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedModel === key ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {key.replace('-', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Prompt */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Custom Prompt (Optional)</Text>
            <TextInput
              value={customPrompt}
              onChangeText={setCustomPrompt}
              placeholder="Leave empty to use default prompt for selected category"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              className="bg-white p-4 rounded-xl border border-gray-200"
              style={{ color: '#1f2937' }}
            />
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            onPress={handleGenerateTemplate}
            disabled={isGenerating || !ENV.OPENROUTER_API_KEY}
            className={`flex-row items-center justify-center p-4 rounded-xl mb-6 ${
              isGenerating || !ENV.OPENROUTER_API_KEY ? 'bg-gray-300' : 'bg-blue-500'
            }`}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Ionicons name="sparkles" size={20} color="#ffffff" />
            )}
            <Text className="text-white font-semibold ml-2">
              {isGenerating ? 'Generating...' : 'Generate Template'}
            </Text>
          </TouchableOpacity>

          {/* Generated Content */}
          {generatedBody && (
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-3">Generated Template</Text>
              
              {/* Subject Line */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-600 mb-2">Subject Line</Text>
                <View className="bg-white p-4 rounded-xl border border-gray-200">
                  {isGeneratingSubject ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="#3b82f6" />
                      <Text className="text-gray-500 ml-2">Generating subject line...</Text>
                    </View>
                  ) : (
                    <Text className="text-gray-800">{generatedSubject}</Text>
                  )}
                </View>
              </View>

              {/* Email Body */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-600 mb-2">Email Body</Text>
                <View className="bg-white p-4 rounded-xl border border-gray-200">
                  <Text className="text-gray-800 leading-6">{generatedBody}</Text>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSave}
                className="bg-green-500 p-4 rounded-xl"
              >
                <Text className="text-white font-semibold text-center">Save Template</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};