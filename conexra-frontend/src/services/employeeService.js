import api from '../api';

export const getCurrentProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateCurrentProfile = async (payload) => {
  const response = await api.put('/auth/me', payload);
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await api.put('/auth/change-password', payload);
  return response.data;
};

export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const createEmployee = async (payload) => {
  const response = await api.post('/employees', payload);
  return response.data;
};

export const updateEmployee = async (id, payload) => {
  const response = await api.put(`/employees/${id}`, payload);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};
