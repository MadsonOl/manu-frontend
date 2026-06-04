import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const CHAVE_FUNCOES = ["funcoes"];

/**
 * Lista de funcoes (lista secundaria do cadastro de profissionais). Falha de
 * carga e tratada como lista vazia para nao travar o formulario.
 */
export function useFuncoes() {
  return useQuery({
    queryKey: CHAVE_FUNCOES,
    queryFn: () => api.get("/funcoes").then((r) => r.data),
    placeholderData: [],
  });
}

/** Cria uma funcao e revalida a lista. */
export function useCriarFuncao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (nome) => api.post("/funcoes", { nome }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE_FUNCOES }),
  });
}
