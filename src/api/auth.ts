import { api } from './client';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string; country?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  me: () => api.get<{ user: User }>('/auth/me'),

  updateProfile: (data: { name?: string; phone?: string; country?: string }) =>
    api.put<{ user: User }>('/auth/me', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<{ message: string }>('/auth/change-password', data),
};
