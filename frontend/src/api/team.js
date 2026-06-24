import client from './client';

export const teamAPI = {
  get: () => client.get('/team').then((r) => r.data),
  invite: (data) => client.post('/team/invite', data).then((r) => r.data),
  updateRole: (email, role) => client.put(`/team/members/${encodeURIComponent(email)}`, { role }).then((r) => r.data),
  remove: (email) => client.delete(`/team/members/${encodeURIComponent(email)}`).then((r) => r.data),
};
