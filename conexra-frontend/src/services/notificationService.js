import api from '../api';

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.post('/notifications/read');
  return response.data;
};