/* eslint-disable react-refresh/only-export-components --
   Colocacao intencional do hook useAuth com o AuthProvider. O aviso e apenas
   sobre HMR/fast-refresh em desenvolvimento e nao afeta o build. */
import { createContext, useContext, useEffect, useState } from "react";
import { getFirebaseAuth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Assina o estado de autenticacao apos carregar o Firebase sob demanda. As
  // paginas publicas nao ficam bloqueadas: os filhos sempre sao renderizados e
  // quem precisa do estado (PrivateRoute) trata o "carregando".
  useEffect(() => {
    let ativo = true;
    let unsubscribe;
    (async () => {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged } = await import("firebase/auth");
      if (!ativo) return;
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUsuario(user);
        setCarregando(false);
      });
    })();
    return () => {
      ativo = false;
      unsubscribe?.();
    };
  }, []);

  async function login(email, senha) {
    const auth = await getFirebaseAuth();
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    return signInWithEmailAndPassword(auth, email, senha);
  }

  async function logout() {
    const auth = await getFirebaseAuth();
    const { signOut } = await import("firebase/auth");
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}
