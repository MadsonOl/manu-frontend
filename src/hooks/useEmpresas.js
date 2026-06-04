import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const CHAVE_EMPRESAS = ["empresas"];

/** Lista de empresas. */
export function useEmpresas() {
  return useQuery({
    queryKey: CHAVE_EMPRESAS,
    queryFn: () => api.get("/empresas").then((r) => r.data),
  });
}

/** Cria (sem id) ou atualiza (com id) uma empresa e revalida a lista. */
export function useSalvarEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) =>
      id ? api.put(`/empresas/${id}`, payload) : api.post("/empresas", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE_EMPRESAS }),
  });
}

/** Exclui uma empresa e revalida a lista. */
export function useExcluirEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/empresas/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE_EMPRESAS }),
  });
}
