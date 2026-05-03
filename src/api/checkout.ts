import { api } from './client';
import type { OrderItem } from './orders';

export const checkoutApi = {
  createSession: (payload: {
    items: OrderItem[];
    guestEmail?: string;
    currency?: string;
    orderId?: string;
  }) => api.post<{ url: string; sessionId: string }>('/checkout/create-session', payload),
};
