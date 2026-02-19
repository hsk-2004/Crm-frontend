import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── TEMP: Auth disabled — 401s are silently ignored (no redirect) ──
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just pass the error through — no automatic logout redirect
    return Promise.reject(error);
  }
);

export default apiClient;
