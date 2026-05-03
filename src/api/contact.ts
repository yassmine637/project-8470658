import { api } from './client';

export interface ContactPayload {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  pays?: string;
  sujet: string;
  message: string;
}

export const contactApi = {
  send: (payload: ContactPayload) =>
    api.post<{ success: boolean; message: string }>('/contact', payload),
};
