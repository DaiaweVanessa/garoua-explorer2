import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import * as authService from '@/services/auth';
import { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!localStorage.getItem('accessToken')) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authService.fetchMe();
        if (!cancelled) setUser(me);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login: async (email, password) => {
        const loggedInUser = await authService.login({ email, password });
        setUser(loggedInUser);
      },
      register: async (name, email, password) => {
        const newUser = await authService.register({ name, email, password });
        setUser(newUser);
      },
      logout: async () => {
        await authService.logout();
        setUser(null);
      },
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>');
  return ctx;
}