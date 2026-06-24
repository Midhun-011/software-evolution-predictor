import client from './client';

export const notifAPI = {
  list: (params) => client.get('/notifications', { params }).then((r) => r.data),
  markRead: (id) => client.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => client.patch('/notifications/read-all').then((r) => r.data),
};
