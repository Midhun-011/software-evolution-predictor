import client from './client';

export const repoAPI = {
  list: (params) => client.get('/repositories', { params }).then((r) => r.data),
  add: (data) => client.post('/repositories', data).then((r) => r.data),
  update: (id, data) => client.put(`/repositories/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/repositories/${id}`).then((r) => r.data),
  toggleFavorite: (id) => client.patch(`/repositories/${id}/favorite`).then((r) => r.data),
  analyze: (id) => client.post(`/repositories/${id}/analyze`).then((r) => r.data),
};
