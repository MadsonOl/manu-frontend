import { env } from "./config/env";

/*
 * Inicializacao preguicosa (lazy) do Firebase. O SDK (~113 KB) so e carregado
 * via dynamic import quando a autenticacao e realmente necessaria — login,
 * cadastro, recuperacao de senha, requisicoes autenticadas ou ao montar uma
 * rota privada. Assim ele sai do caminho critico de renderizacao, acelerando o
 * primeiro paint, especialmente nas paginas publicas (ex.: o formulario de
 * chamado, que nao usa auth). A instancia e cacheada apos a primeira chamada.
 */
let authPromise = null;

export function getFirebaseAuth() {
  if (!authPromise) {
    authPromise = (async () => {
      const [{ initializeApp }, { getAuth }] = await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
      ]);
      const app = initializeApp(env.firebase);
      return getAuth(app);
    })();
  }
  return authPromise;
}
