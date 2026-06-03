import { useCallback, useSyncExternalStore } from "react";

/*
 * Acompanha um media query e retorna true enquanto ele casar. Usado para
 * decidir comportamentos especificos de mobile em JS (ex.: tornar a sidebar
 * fora da tela inerte ao teclado), sem depender apenas de CSS.
 *
 * Implementado com useSyncExternalStore: assina o matchMedia como fonte
 * externa, sem chamar setState dentro de efeito, e com snapshot de servidor
 * (false) para ambientes sem window.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
