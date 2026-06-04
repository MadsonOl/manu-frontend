import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const CHAVE_ORDENS = ["ordens-servico"];

/**
 * Lista de ordens de servico. Mesma chave usada por Ordens de Servico,
 * Relatorios e Dashboard — o cache e compartilhado entre essas telas.
 */
export function useOrdens() {
  return useQuery({
    queryKey: CHAVE_ORDENS,
    queryFn: () => api.get("/ordens-servico").then((r) => r.data),
  });
}

/** Finaliza uma OS (status -> FINALIZADO) e revalida a lista. */
export function useFinalizarOrdem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/ordens-servico/${id}/finalizar`),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE_ORDENS }),
  });
}

/** Exclui uma OS e revalida a lista. */
export function useExcluirOrdem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/ordens-servico/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE_ORDENS }),
  });
}
