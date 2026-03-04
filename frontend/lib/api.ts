import axios, { AxiosInstance } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create a base axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('flowza_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, clear auth and redirect to login
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('flowza_token');
      localStorage.removeItem('flowza_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
