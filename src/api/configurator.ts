import { api } from './client';

export interface ConfiguratorPayload {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  currency?: string;
  configuration: {
    model: { id: string; name: string; basePrice: number };
    size: { id: string; label: string; volume: string; priceAdd: number };
    label?: { id: string; name: string; priceAdd: number } | null;
    customText?: string;
  };
  quantity?: number;
  totalHT: number;
  totalTTC: number;
  message?: string;
}

export const configuratorApi = {
  submit: (payload: ConfiguratorPayload) => api.post<{ devisNumber: string }>('/configurator', payload),
  track: (devisNumber: string) => api.get<{ status: string; devisNumber: string }>(`/configurator/track/${devisNumber}`),
};
