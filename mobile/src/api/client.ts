import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({ 
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token, refresh_token } = response.data;
          await SecureStore.setItemAsync("access_token", access_token);
          await SecureStore.setItemAsync("refresh_token", refresh_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
        // You can emit an event here to trigger navigation to login
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: { email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const contactsAPI = {
  getContacts: (params?: { page?: number; per_page?: number; tag?: string; q?: string }) =>
    api.get("/contacts", { params }),
  createContact: (data: any) => api.post("/contacts", data),
  getContact: (id: string) => api.get(`/contacts/${id}`),
  updateContact: (id: string, data: any) => api.put(`/contacts/${id}`, data),
  deleteContact: (id: string) => api.delete(`/contacts/${id}`),
  importContacts: (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/contacts/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const templatesAPI = {
  getTemplates: () => api.get("/templates"),
  createTemplate: (data: any) => api.post("/templates", data),
  getTemplate: (id: string) => api.get(`/templates/${id}`),
  updateTemplate: (id: string, data: any) => api.put(`/templates/${id}`, data),
  deleteTemplate: (id: string) => api.delete(`/templates/${id}`),
};



export const messagesAPI = {
  getMessages: (params?: { status?: string; contact_id?: string }) =>
    api.get("/messages", { params }),
  getMessage: (id: string) => api.get(`/messages/${id}`),
  previewMessage: (data: any) => api.post("/messages/preview", data),
};
