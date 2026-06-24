import client from './client';

export const activityAPI = {
  list: (params) => client.get('/activity', { params }).then((r) => r.data),
};
