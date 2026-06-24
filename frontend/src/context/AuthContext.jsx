import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const verifiedUser = await authAPI.verify();
        if (verifiedUser) {
          setUser(verifiedUser);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      setUser(response.user);
      console.log('Login successful:', response.user);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
      console.error('Login failed:', errorMsg);
      throw err;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      setError(null);
      const response = await authAPI.register(name, email, password, confirmPassword);
      setUser(response.user);
      console.log('Registration successful:', response.user);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMsg);
      console.error('Registration failed:', errorMsg);
      throw err;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
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
