import React, { useState } from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { 
  ThemedView, 
  ThemedText, 
  ThemedInput, 
  ThemedButton, 
  ThemedCard,
  ThemedIcon 
} from '../theme/components';
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.login(credentials.email, credentials.password),
    onSuccess: async (response) => {
      const data = response.data as any;
      if (data?.access_token) {
        try {
          await login(data.access_token);
        } catch (error) {
          Alert.alert('Error', 'Failed to save login session');
        }
      } else {
        Alert.alert('Error', response.error || 'Login failed');
      }
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.register(credentials.email, credentials.password),
    onSuccess: async (response) => {
      const data = response.data as any;
      if (data?.access_token) {
        try {
          await login(data.access_token);
          Alert.alert('Success', 'Account created successfully!');
        } catch (error) {
          Alert.alert('Error', 'Failed to save login session');
        }
      } else {
        Alert.alert('Error', response.error || 'Registration failed');
      }
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Registration failed');
    },
  });

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isRegistering) {
      registerMutation.mutate({ email: email.trim(), password });
    } else {
      loginMutation.mutate({ email: email.trim(), password });
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ThemedView variant="primary" style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <ThemedText size="3xl" weight="bold" style={{ marginBottom: 8, textAlign: 'center' }}>
            LeadMessenger
          </ThemedText>
          <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </ThemedText>
        </View>

        {/* Form */}
        <ThemedCard variant="elevated" style={{ marginBottom: 24 }}>
          <View style={{ gap: 16 }}>
            <View>
              <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>
                Email
              </ThemedText>
              <ThemedInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View>
              <ThemedText size="sm" weight="medium" style={{ marginBottom: 8 }}>
                Password
              </ThemedText>
              <ThemedInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>

            {/* Submit Button */}
            <ThemedButton
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
              size="lg"
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </ThemedButton>

            {/* Toggle Register/Login */}
            <ThemedButton
              onPress={() => setIsRegistering(!isRegistering)}
              disabled={isLoading}
              variant="ghost"
            >
              {isRegistering
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </ThemedButton>
          </View>
        </ThemedCard>

        {/* Demo Credentials */}
        <ThemedCard variant="outlined" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
          <ThemedText size="lg" weight="medium" style={{ marginBottom: 8, color: '#1e40af' }}>
            Demo Credentials:
          </ThemedText>
          <ThemedText size="sm" style={{ color: '#1e40af' }}>
            Email: test@example.com
          </ThemedText>
          <ThemedText size="sm" style={{ color: '#1e40af' }}>
            Password: password
          </ThemedText>
        </ThemedCard>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};
