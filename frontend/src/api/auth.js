import client from './client';

export const authAPI = {
  register: async (name, email, password, confirmPassword) => {
    const response = await client.post('/auth/register', { name, email, password, confirmPassword });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await client.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verify: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const response = await client.get('/auth/verify');
      return response.data.user;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
