import api from '../api';

// Admin endpoints
export const getAllTasksAdmin = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
  if (filters.employeeId) params.append('employeeId', filters.employeeId);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await api.get(`/tasks/admin/all${query}`);
  console.log('All tasks (admin):', response.data);
  return response.data;
};

export const getTaskStatsAdmin = async () => {
  const response = await api.get('/tasks/admin/stats');
  console.log('Task stats (admin):', response.data);
  return response.data;
};

// Employee endpoints
export const getPendingTasks = async () => {
  const response = await api.get('/tasks/pending');
  console.log('Pending tasks:', response.data);
  return response.data;
};

export const getAllTasks = async () => {
  const response = await api.get('/tasks/all');
  console.log('All tasks:', response.data);
  return response.data;
};

export const getTaskStats = async () => {
  const response = await api.get('/tasks/stats');
  console.log('Task stats:', response.data);
  return response.data;
};

// CRUD operations
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  console.log('Task created:', response.data);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  console.log('Task updated:', response.data);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.put(`/tasks/${taskId}/status`, { status });
  console.log('Task updated:', response.data);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  console.log('Task deleted:', response.data);
  return response.data;
};
