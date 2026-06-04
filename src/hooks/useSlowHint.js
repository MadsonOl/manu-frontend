import { useEffect, useState } from "react";

/*
 * Retorna true quando um carregamento passa de `delay` ms — usado para avisar
 * que o backend pode estar reativando (cold start). Enquanto `ativo` for falso,
 * o timer e cancelado e o aviso e reposto no desmonte do efeito.
 */
export function useSlowHint(ativo, delay = 8000) {
  const [lento, setLento] = useState(false);

  useEffect(() => {
    if (!ativo) return undefined;
    const timer = setTimeout(() => setLento(true), delay);
    return () => {
      clearTimeout(timer);
      setLento(false);
    };
  }, [ativo, delay]);

  return lento;
}
