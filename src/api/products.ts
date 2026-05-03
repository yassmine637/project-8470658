import { api } from './client';

export interface ApiProduct {
  _id: string;
  slug: string;
  name: string;
  volume: string;
  price: number;
  currency: string;
  tagline: string;
  description: string;
  details: string[];
  badge?: string;
  accentColor?: string;
  imageScale?: number;
  stock: number;
  active: boolean;
}

export const productsApi = {
  getAll: () => api.get<ApiProduct[]>('/products'),
  getBySlug: (slug: string) => api.get<ApiProduct>(`/products/${slug}`),
};
