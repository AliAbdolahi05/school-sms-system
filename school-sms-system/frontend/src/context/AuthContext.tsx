import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  role: 'ADMIN' | 'ASSISTANT' | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<'ADMIN' | 'ASSISTANT' | null>(localStorage.getItem('role') as any);

  const login = async (username: string, password: string) => {
    const res = await axios.post('/api/auth/login', { username, password });
    setToken(res.data.token);
    setRole(res.data.role);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}