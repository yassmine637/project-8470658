import { api } from './client';

export interface OrderItem {
  productId: string;
  productName: string;
  volume?: string;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  currency?: string;
  shippingAddress?: { country?: string; city?: string; address?: string };
  notes?: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  currency: string;
  status: string;
  guestName?: string;
  guestEmail?: string;
  createdAt: string;
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) => api.post<Order>('/orders', payload),
  createAuthenticated: (payload: Omit<CreateOrderPayload, 'guestName' | 'guestEmail' | 'guestPhone'>) =>
    api.post<Order>('/orders/authenticated', payload),
  myOrders: () => api.get<Order[]>('/orders/my'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
};
