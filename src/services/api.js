import axios from "axios";
import { auth } from "../firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  console.log("[api] auth.currentUser:", user ? user.email : "null");

  if (user) {
    try {
      const token = await user.getIdToken();
      console.log("[api] token obtido:", token.substring(0, 30) + "...");
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("[api] erro ao obter token:", err);
    }
  } else {
    console.warn("[api] usuario nao autenticado, requisicao sem token");
  }

  return config;
});

export default api;
