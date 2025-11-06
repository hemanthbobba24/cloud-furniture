// src/lib/api.js - ENHANCED VERSION
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: false,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cf_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from various possible locations
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.details ||
      error?.message ||
      "Request failed";

    // Handle 401 Unauthorized - token expired or invalid
    if (error?.response?.status === 401) {
      // Clear auth data if token is invalid
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
        console.warn('[API] 401 Unauthorized - clearing auth data');
        localStorage.removeItem("cf_token");
        localStorage.removeItem("cf_email");
        localStorage.removeItem("cf_role");
        
        // Optional: redirect to login
        // window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error?.response?.status === 403) {
      console.error('[API] 403 Forbidden - insufficient permissions');
    }

    // Handle 404 Not Found
    if (error?.response?.status === 404) {
      console.error('[API] 404 Not Found:', error.config?.url);
    }

    // Handle network errors
    if (!error?.response) {
      console.error('[API] Network error - server may be down');
      error.message = 'Cannot connect to server. Please check if the backend is running.';
    }

    // Attach friendly message to error object
    error.message = msg;
    error._friendly = msg;
    
    return Promise.reject(error);
  }
);

export default api;