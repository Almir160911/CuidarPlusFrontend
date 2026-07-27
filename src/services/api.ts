import axios from 'axios';

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    'http://localhost:5184',
  headers: {
    'Content-Type': 'application/json',
  },
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
      localStorage.removeItem('cuidarplus_token');
      localStorage.removeItem('cuidarplus_user');

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default api;