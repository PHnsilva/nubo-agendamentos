import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { AuthResponse, Role, User } from '../types/api';
import { clearAuthSession, getStoredUser, setAuthSession } from '../services/apiClient';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  applyAuth: (auth: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AppProviders({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  useEffect(() => {
    const refreshUser = () => setUser(getStoredUser());
    const clearUser = () => setUser(null);

    window.addEventListener('nubo:auth-changed', refreshUser);
    window.addEventListener('nubo:auth-cleared', clearUser);
    return () => {
      window.removeEventListener('nubo:auth-changed', refreshUser);
      window.removeEventListener('nubo:auth-cleared', clearUser);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      hasAnyRole: (roles) => Boolean(user && roles.includes(user.role)),
      applyAuth: (auth) => {
        setAuthSession(auth);
        setUser(auth.user);
      },
      logout: () => {
        clearAuthSession();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth deve ser usado dentro de AppProviders.');
  return value;
}
