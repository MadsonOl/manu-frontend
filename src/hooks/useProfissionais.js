import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const CHAVE_PROFISSIONAIS = ["profissionais"];

/** Lista de profissionais. */
export function useProfissionais() {
  return useQuery({
    queryKey: CHAVE_PROFISSIONAIS,
    queryFn: () => api.get("/profissionais").then((r) => r.data),
  });
}

/** Cria (sem id) ou atualiza (com id) um profissional e revalida a lista. */
export function useSalvarProfissional() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? api.put(`/profissionais/${id}`, payload) : api.post("/profissionais", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE_PROFISSIONAIS }),
  });
}

/** Exclui um profissional e revalida a lista. */
export function useExcluirProfissional() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/profissionais/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE_PROFISSIONAIS }),
  });
}
