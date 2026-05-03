import { api } from './client';

export const adminApi = {
  stats: () =>
    api.get<{
      totalOrders: number;
      totalUsers: number;
      pendingConfigs: number;
      unreadMessages: number;
      totalProducts: number;
      revenue: number;
    }>('/admin/stats'),

  orders: (params?: { page?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.status) q.set('status', params.status);
    return api.get<{ orders: unknown[]; total: number; pages: number }>(`/admin/orders?${q}`);
  },

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status }),

  configuratorOrders: (params?: { page?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.status) q.set('status', params.status);
    return api.get<{ orders: unknown[]; total: number; pages: number }>(`/admin/configurator-orders?${q}`);
  },

  updateConfigStatus: (id: string, status: string) =>
    api.put(`/admin/configurator-orders/${id}/status`, { status }),

  messages: (params?: { page?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    return api.get<{ messages: unknown[]; total: number; pages: number }>(`/admin/messages?${q}`);
  },

  markMessageRead: (id: string) => api.put(`/admin/messages/${id}/read`, {}),

  users: () => api.get<unknown[]>('/admin/users'),
};
