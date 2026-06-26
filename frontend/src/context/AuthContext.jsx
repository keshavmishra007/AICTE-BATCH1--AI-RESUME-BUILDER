import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('careerforge_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('careerforge_user');
    return raw ? JSON.parse(raw) : null;
  });

  async function authenticate(mode, payload) {
    const { data } = await api.post(`/auth/${mode}`, payload);
    localStorage.setItem('careerforge_token', data.token);
    localStorage.setItem('careerforge_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('careerforge_token');
    localStorage.removeItem('careerforge_user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, isAuthenticated: Boolean(token), authenticate, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
