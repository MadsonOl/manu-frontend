import axios from "axios";
import { auth } from "../firebase";
import { mensagemDeErro } from "./apiErrors";

export { mensagemDeErro };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Timeout amplo: o backend pode estar "frio" e levar ate ~1 minuto para
  // acordar apos inatividade. Acima desse limite falhamos com mensagem clara
  // em vez de deixar a requisicao pendurada indefinidamente.
  timeout: 75000,
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
    // Rejeita com uma mensagem amigavel (usada pela UI), preservando o erro
    // original em `cause` para depuracao em desenvolvimento.
    const amigavel = new Error(mensagemDeErro(error));
    amigavel.cause = error;
    return Promise.reject(amigavel);
  }
);

export default api;
