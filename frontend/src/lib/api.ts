import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Default backend URL. In production, this would be determined by env vars.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle token refresh / 401s via cookies
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 401 Unauthorized and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh/') {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using HttpOnly refresh cookie
        await axios.post(`${API_BASE_URL}/auth/refresh/`, {}, { withCredentials: true });
        
        // Retry the original request (browser will automatically include the new access cookie)
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
