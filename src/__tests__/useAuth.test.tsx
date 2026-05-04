import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

vi.mock('@/api/auth', () => ({
  authApi: {
    me: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
}));

import { authApi } from '@/api/auth';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockUser = {
  _id: 'user-123',
  name: 'Test User',
  email: 'test@fendri.com',
  role: 'user' as const,
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.mocked(authApi.me).mockRejectedValue(new Error('Not authenticated'));
});

describe('useAuth', () => {
  it('starts unauthenticated with no user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it('logs in a user and stores token', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ user: mockUser, token: 'test-token' });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('test@fendri.com', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('test-token');
    expect(localStorage.getItem('fendri_token')).toBe('test-token');
  });

  it('identifies admin users correctly', async () => {
    const adminUser = { ...mockUser, role: 'admin' as const };
    vi.mocked(authApi.login).mockResolvedValue({ user: adminUser, token: 'admin-token' });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('admin@fendri.com', 'Admin2025!');
    });

    expect(result.current.isAdmin).toBe(true);
  });

  it('registers a new user', async () => {
    vi.mocked(authApi.register).mockResolvedValue({ user: mockUser, token: 'new-token' });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@fendri.com',
        password: 'password123',
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('new-token');
  });

  it('logs out and clears token', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ user: mockUser, token: 'test-token' });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('test@fendri.com', 'password123');
    });
    act(() => { result.current.logout(); });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('fendri_token')).toBeNull();
  });

  it('restores session from stored token', async () => {
    localStorage.setItem('fendri_token', 'stored-token');
    vi.mocked(authApi.me).mockResolvedValue({ user: mockUser });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('stored-token');
  });

  it('clears invalid token on startup', async () => {
    localStorage.setItem('fendri_token', 'invalid-token');
    vi.mocked(authApi.me).mockRejectedValue(new Error('Token invalide'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('fendri_token')).toBeNull();
  });

  it('throws when used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within AuthProvider'
    );
  });
});
