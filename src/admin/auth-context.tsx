/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { fetchRoutes, loginRequest, RouteSummary } from './api';
import { ACCESS_TOKEN_KEY, AUTH_USER_KEY, clearStored, getStored, REFRESH_TOKEN_KEY, setStored } from './auth-storage';

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  routes: RouteSummary[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  reloadRoutes: () => Promise<void>;
  isLoadingRoutes: boolean;
  authError: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => getStored<string>(ACCESS_TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => getStored<string>(REFRESH_TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => getStored<AuthUser>(AUTH_USER_KEY));
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const reloadRoutes = useCallback(async () => {
    if (!accessToken) {
      setRoutes([]);
      return;
    }
    setIsLoadingRoutes(true);
    try {
      const data = await fetchRoutes(accessToken);
      setRoutes(data);
      setAuthError(null);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setIsLoadingRoutes(false);
    }
  }, [accessToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginRequest(email, password);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      const normalizedUser: AuthUser = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
      };
      setUser(normalizedUser);
      setStored(ACCESS_TOKEN_KEY, response.accessToken);
      setStored(REFRESH_TOKEN_KEY, response.refreshToken);
      setStored(AUTH_USER_KEY, normalizedUser);
      setAuthError(null);
      await reloadRoutes();
    },
    [reloadRoutes],
  );

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setRoutes([]);
    clearStored();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      routes,
      login,
      logout,
      reloadRoutes,
      isLoadingRoutes,
      authError,
    }),
    [user, accessToken, refreshToken, routes, login, logout, reloadRoutes, isLoadingRoutes, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

