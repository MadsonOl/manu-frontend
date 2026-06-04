import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "./Layout";
import PageLoader from "./PageLoader";

export default function PrivateRoute({ children }) {
  const { usuario, carregando } = useAuth();
  // Enquanto o estado de autenticacao carrega (inclui o carregamento sob
  // demanda do Firebase), mostra um indicador em vez de tela em branco.
  if (carregando) return <PageLoader />;
  if (!usuario) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}
