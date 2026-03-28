import axios from "axios";
import { auth } from "../firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getToken = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        try {
          const token = await user.getIdToken(true);
          resolve(token);
        } catch {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.MODE === 'production') {
      const status = error.response?.status;
      const genericMessage =
        status === 401 || status === 403
          ? 'Sessão expirada. Faça login novamente.'
          : 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
      return Promise.reject(new Error(genericMessage));
    }
    return Promise.reject(error);
  }
);

export default api;
