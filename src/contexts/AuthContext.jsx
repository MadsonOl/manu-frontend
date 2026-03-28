import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  function login(email, senha) {
    return signInWithEmailAndPassword(auth, email, senha);
  }

  function logout() {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {!carregando && children}
    </AuthContext.Provider>
  );
}
