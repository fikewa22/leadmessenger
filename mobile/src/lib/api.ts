import { ENV } from '../config/env';

const API_BASE_URL = ENV.API_URL;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    console.log('API Client initialized with URL:', this.baseUrl);
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Contact endpoints
  async getContacts() {
    return this.request('/api/v1/contacts');
  }

  async createContact(contactData: any) {
    return this.request('/api/v1/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async updateContact(id: string, contactData: any) {
    return this.request(`/api/v1/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
  }

  async deleteContact(id: string) {
    return this.request(`/api/v1/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  async importContacts(csvData: string) {
    return this.request('/api/v1/contacts/import', {
      method: 'POST',
      body: JSON.stringify({ csv_data: csvData }),
    });
  }

  // Template endpoints
  async getTemplates() {
    return this.request('/api/v1/templates/');
  }

  async createTemplate(templateData: any) {
    return this.request('/api/v1/templates/', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  // Task endpoints
  async getTasks() {
    return this.request('/api/v1/tasks/');
  }

  async createTask(taskData: any) {
    return this.request('/api/v1/tasks/', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, taskData: any) {
    return this.request(`/api/v1/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: string) {
    return this.request(`/api/v1/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Message endpoints
  async getMessages(contactId?: string) {
    const params = contactId ? `?contact_id=${contactId}` : '';
    return this.request(`/api/v1/messages/${params}`);
  }

  async sendMessage(messageData: {
    contact_id: string;
    channel: string;
    subject?: string;
    body: string;
    scheduled_at?: string;
  }) {
    return this.request('/api/v1/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async sendBulkMessages(messages: Array<{
    contact_id: string;
    channel: string;
    subject?: string;
    body: string;
    scheduled_at?: string;
  }>) {
    return this.request('/api/v1/messages/bulk', {
      method: 'POST',
      body: JSON.stringify(messages),
    });
  }

  async getMessagePreview(contactId: string) {
    return this.request(`/api/v1/messages/preview/${contactId}`);
  }

  async deleteMessage(messageId: string) {
    return this.request(`/api/v1/messages/${messageId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
