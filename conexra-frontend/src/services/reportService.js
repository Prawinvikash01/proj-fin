import api from '../api';

export const getEmployeeStats = async () => {
  const response = await api.get('/reports/employee-stats');
  return response.data;
};

export const getLeaveReport = async () => {
  const response = await api.get('/reports/leaves');
  return response.data;
};

export const getAttendanceReport = async () => {
  const response = await api.get('/reports/attendance');
  return response.data;
};

export const getPayrollReport = async () => {
  const response = await api.get('/reports/payrolls');
  return response.data;
};
