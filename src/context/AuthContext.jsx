import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .checkAuth()
      .then((res) => setAuthenticated(Boolean(res.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const doLogin = useCallback(async (password) => {
    setError(null);
    try {
      await api.login(password);
      setAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const doLogout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, loading, error, login: doLogin, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
