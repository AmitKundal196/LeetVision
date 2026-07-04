import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import type { User, OnboardingData } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  oauthLogin: (provider: 'google' | 'github', email?: string) => Promise<void>;
  logout: () => Promise<void>;
  saveOnboarding: (data: OnboardingData) => Promise<void>;
  updateUserDirectly: (updatedUser: User) => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse cached user object', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password, rememberMe });
      if (data.success) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { email, password, name });
      if (data.success) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const oauthLogin = async (provider: 'google' | 'github', email?: string) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/oauth/mock/${provider}`, { email });
      if (data.success) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'OAuth authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.warn('Network request failed during logout:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  };

  const saveOnboarding = async (onboardingData: OnboardingData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/onboarding', onboardingData);
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Saving onboarding details failed');
    } finally {
      setLoading(false);
    }
  };

  const updateUserDirectly = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Forgot password request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, oauthLogin, logout, saveOnboarding, updateUserDirectly, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
