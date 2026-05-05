import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, type User } from '@/api/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; country?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fendri_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('fendri_token');
      if (stored) {
        try {
          const { user } = await authApi.me();
          setUser(user);
          setToken(stored);
        } catch {
          localStorage.removeItem('fendri_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authApi.login({ email, password });
    localStorage.setItem('fendri_token', token);
    localStorage.setItem('fendri_returning_user', 'true');
    setToken(token);
    setUser(user);
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; phone?: string; country?: string }) => {
    const { user, token } = await authApi.register(data);
    localStorage.setItem('fendri_token', token);
    localStorage.setItem('fendri_returning_user', 'true');
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fendri_token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((u: User) => {
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin: user?.role === 'admin', login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
