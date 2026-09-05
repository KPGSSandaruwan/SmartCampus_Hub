import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('uniconnect_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: userToken, ...userData } = res.data;
    localStorage.setItem('uniconnect_token', userToken);
    setToken(userToken);
    setUser(userData);
    return res.data;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { token: userToken, ...userData } = res.data;
    localStorage.setItem('uniconnect_token', userToken);
    setToken(userToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('uniconnect_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
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
