import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({ baseURL: API_URL });

// Attache automatiquement le token d'accès à chaque requête si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le token d'accès a expiré (401), on tente un refresh silencieux une seule fois puis on rejoue la requête
let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return Promise.reject(error);

      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${API_URL}/auth/refresh`, { refreshToken })
          .then((res) => {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            return accessToken as string;
          })
          .catch(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      if (newAccessToken) {
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

// Type de réponse standard de l'API (voir errorHandler backend)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { page: number; limit: number; total: number };
}

export interface ApiError {
  success: false;
  error: { code: string; message: string };
}