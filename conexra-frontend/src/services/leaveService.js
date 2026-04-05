import api from '../api';

export const getLeaves = async () => {
  const response = await api.get('/leaves');
  console.log('Fetched leaves:', response.data);
  return response.data;
};

export const applyLeave = async (payload) => {
  console.log('Applying for leave with payload:', payload);
  const response = await api.post('/leaves', payload);
  return response.data;
};

export const updateLeaveStatus = async (id, status) => {
  const response = await api.put(`/leaves/${id}/status`, { status });
  return response.data;
};
