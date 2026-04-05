import api from '../api';

export const getAttendance = async () => {
  const response = await api.get('/attendance');
  console.log('Attendance data:', response.data); // Debug log
  return response.data;
};

export const checkIn = async () => {
  const response = await api.post('/attendance/check-in');
  return response.data;
};

export const checkOut = async () => {
  const response = await api.post('/attendance/check-out');
  return response.data;
};
