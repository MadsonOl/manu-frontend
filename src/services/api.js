import axios from "axios";
import { auth } from "../firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Timeout amplo: o backend pode estar "frio" e levar ate ~1 minuto para
  // acordar apos inatividade. Acima desse limite falhamos com mensagem clara
  // em vez de deixar a requisicao pendurada indefinidamente.
  timeout: 75000,
});

/*
 * Traduz qualquer erro de requisicao em uma mensagem clara e especifica para a
 * UI, sem expor detalhes internos. Cobre o cold start (timeout), ausencia de
 * conexao, sessao expirada, nao encontrado, dados invalidos e erro de servidor.
 */
export function mensagemDeErro(error) {
  if (error?.code === "ECONNABORTED" || /timeout/i.test(error?.message || "")) {
    return "O servidor demorou a responder. Ele pode estar reativando apos um periodo ocioso - tente novamente em instantes.";
  }
  if (!error?.response) {
    return "Nao foi possivel conectar ao servidor. Verifique sua conexao e tente novamente.";
  }
  const status = error.response.status;
  if (status === 401 || status === 403) return "Sessao expirada. Faca login novamente.";
  if (status === 404) return "Registro nao encontrado.";
  if (status === 400 || status === 422) {
    const msg = error.response.data?.message || error.response.data?.erro;
    return msg || "Dados invalidos. Verifique os campos e tente novamente.";
  }
  if (status >= 500) return "O servidor encontrou um erro. Tente novamente mais tarde.";
  return "Ocorreu um erro inesperado. Tente novamente.";
}

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
