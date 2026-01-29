import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email, password) =>
    api.post('/auth/register', { email, password }),

  verifyEmail: (token) =>
    api.post('/auth/verify-email', { token }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }),

  getMe: () =>
    api.get('/auth/me'),
};

// Boards API
export const boardsAPI = {
  getAll: () =>
    api.get('/boards'),

  getOne: (id) =>
    api.get(`/boards/${id}`),

  create: (data) =>
    api.post('/boards', data),

  update: (id, data) =>
    api.put(`/boards/${id}`, data),

  delete: (id) =>
    api.delete(`/boards/${id}`),
};

// Todos API
export const todosAPI = {
  getAll: (boardId) =>
    api.get(`/todos/boards/${boardId}/todos`),

  getOne: (id) =>
    api.get(`/todos/${id}`),

  create: (boardId, data) =>
    api.post('/tasks', { boardId, ...data }),

  update: (id, data) =>
    api.put(`/todos/${id}`, data),

  reorder: (todos) =>
    api.put('/todos/reorder', { todos }),

  delete: (id) =>
    api.delete(`/todos/${id}`),
};

export default api;
