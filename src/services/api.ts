import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  'http://localhost:5184';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cuidarplus_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url ?? '');

      // Não remove a sessão quando o próprio login retorna 401.
      if (!requestUrl.includes('/api/auth/login')) {
        localStorage.removeItem('cuidarplus_token');
        localStorage.removeItem('cuidarplus_user');
      }
    }

    return Promise.reject(error);
  },
);

export default api;