import axios from 'axios';

const API_BASE_URL_PORT = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://leetvision.onrender.com/api');
const api = axios.create({
  baseURL: API_BASE_URL_PORT,
  headers: {
    'Content-Type': 'application/json',
  },
});

import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Inject Access Token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response Interceptor for Token Rotation
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // Guard to avoid infinite loops
    if (!error.response || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const responseStatus = error.response.status;
    const responseError = error.response.data?.error;

    // Check if unauthorized and token has expired
    if (responseStatus === 401 && responseError === 'TokenExpired') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        handleLogoutRedirect();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL_PORT}/auth/refresh`, { refreshToken });
        if (data.success && data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          
          processQueue(null, data.accessToken);
          isRefreshing = false;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        handleLogoutRedirect();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

function handleLogoutRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login?expired=true';
  }
}

export default api;
