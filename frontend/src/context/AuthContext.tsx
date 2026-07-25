import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      username: 'demo_user',
      email: 'demo@auraspeech.ai',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString()
    };
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aura_token') || 'demo_token_123');

  const login = (username: string, newToken: string, userData: User) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('aura_user', JSON.stringify(userData));
    localStorage.setItem('aura_token', newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
