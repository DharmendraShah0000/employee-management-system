import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  const loadMe = useCallback(async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.data.user);
    setEmployee(data.data.employee);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    loadMe()
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, [loadMe]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.data.token);
    await loadMe();
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('token', data.data.token);
    await loadMe();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setEmployee(null);
  };

  const value = useMemo(
    () => ({ user, employee, loading, login, register, logout, refresh: loadMe, isAdmin: user?.role === 'admin' }),
    [user, employee, loading, loadMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
