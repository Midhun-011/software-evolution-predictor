import axios from 'axios';

// Use relative paths in dev, full URL in production
const API_URL = import.meta.env.DEV ? '/api/auth' : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth`;

// Create axios instance with credentials
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (name, email, password, confirmPassword) => {
    try {
      const response = await apiClient.post('/register', {
        name,
        email,
        password,
        confirmPassword
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', {
        email,
        password
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verify: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await apiClient.get('/verify');
      return response.data.user;
    } catch (err) {
      console.error('Token verification failed:', err.response?.data || err.message);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
