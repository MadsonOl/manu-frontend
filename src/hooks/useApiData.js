import { useCallback, useEffect, useState } from "react";

/*
 * Carrega dados de uma chamada de API com:
 *   - estado de carregamento;
 *   - dica de cold start (`slow`) apos alguns segundos sem resposta, para
 *     avisar que o backend pode estar reativando (ate ~1 min);
 *   - mensagem de erro clara (vinda do interceptor da API);
 *   - `reload()` para tentar novamente;
 *   - `setData()` para atualizacoes locais otimistas (ex.: apos excluir).
 *
 * O `fetcher` deve ser estavel (envolva em useCallback no componente).
 */
export function useApiData(fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slow, setSlow] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSlow(false);
    // Apos 8s sem resposta, sinaliza cold start para a UI exibir o aviso.
    const slowTimer = setTimeout(() => setSlow(true), 8000);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.message || "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, error, slow, reload: load };
}
