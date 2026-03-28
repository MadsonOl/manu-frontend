import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "./Layout";

export default function PrivateRoute({ children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}
