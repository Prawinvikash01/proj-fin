import api from '../api';

export const getAttendance = async () => {
  const response = await api.get('/attendance');
  console.log('Attendance data:', response.data);
  return response.data;
};

export const getTodayStatus = async () => {
  const response = await api.get('/attendance/today/status');
  console.log('Today status:', response.data);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/attendance/dashboard/stats');
  console.log('Dashboard stats:', response.data);
  return response.data;
};

export const checkIn = async () => {
  const response = await api.post('/attendance/check-in');
  console.log('Check-in response:', response.data);
  return response.data;
};

export const checkOut = async () => {
  const response = await api.post('/attendance/check-out');
  console.log('Check-out response:', response.data);
  return response.data;
};
