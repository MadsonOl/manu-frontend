import { QueryClient } from "@tanstack/react-query";

/*
 * Cliente unico do TanStack Query: cache, deduplicacao e revalidacao das
 * consultas a API. O retry e seletivo — nao reinsiste em erros do cliente (4xx),
 * apenas em falhas de rede/servidor (uteis no cold start do backend, junto do
 * timeout de 75s do Axios).
 */
function deveTentarNovamente(contagem, error) {
  const status = error?.cause?.response?.status;
  // 4xx (exceto 408 timeout) sao erros do cliente: nao adianta repetir.
  if (status && status >= 400 && status < 500 && status !== 408) return false;
  return contagem < 1;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: deveTentarNovamente,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
