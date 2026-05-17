import { api } from './client';

export const adminApi = {
  stats: () =>
    api.get<{
      totalOrders: number;
      totalUsers: number;
      pendingConfigs: number;
      totalProducts: number;
      revenue: number;
    }>('/admin/stats'),

  orders: (params?: { page?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.status) q.set('status', params.status);
    return api.get<{ orders: unknown[]; total: number; pages: number }>(`/admin/orders?${q}`);
  },

  updateOrderStatus: (id: string, status: string, trackingNumber?: string, carrier?: string) =>
    api.put(`/admin/orders/${id}/status`, { status, trackingNumber, carrier }),

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

  users: () => api.get<unknown[]>('/admin/users'),

  products: () =>
    api.get<{ _id: string; slug: string; name: string; volume: string; stock: number; badge?: string; accentColor?: string }[]>('/admin/products'),

  updateStock: (id: string, stock: number) =>
    api.put<{ _id: string; stock: number }>(`/admin/products/${id}/stock`, { stock }),
};
