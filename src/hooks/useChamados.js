import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const CHAVE_CHAMADOS = ["chamados"];

/** Lista de chamados (cacheada e revalidada pelo TanStack Query). */
export function useChamados() {
  return useQuery({
    queryKey: CHAVE_CHAMADOS,
    queryFn: () => api.get("/chamados").then((r) => r.data),
  });
}

/** Exclui um chamado e invalida a lista em cache. */
export function useExcluirChamado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/chamados/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE_CHAMADOS }),
  });
}
