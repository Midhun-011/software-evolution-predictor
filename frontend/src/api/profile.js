import client from './client';

export const profileAPI = {
  get: () => client.get('/profile').then((r) => r.data),
  update: (data) => client.put('/profile', data).then((r) => r.data),
  changePassword: (data) => client.put('/profile/password', data).then((r) => r.data),
};
