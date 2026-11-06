import api from './client';

export const employeeApi = {
  list: (params) => api.get('/employees', { params }).then((r) => r.data),
  me: () => api.get('/employees/me').then((r) => r.data.data),
  create: (body) => api.post('/employees', body).then((r) => r.data.data),
  update: (id, body) => api.put(`/employees/${id}`, body).then((r) => r.data.data),
  remove: (id) => api.delete(`/employees/${id}`),
};

export const departmentApi = {
  list: () => api.get('/departments').then((r) => r.data.data),
  create: (body) => api.post('/departments', body).then((r) => r.data.data),
  update: (id, body) => api.put(`/departments/${id}`, body).then((r) => r.data.data),
  remove: (id) => api.delete(`/departments/${id}`),
};

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats').then((r) => r.data.data),
};
