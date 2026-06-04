import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "./components/PrivateRoute";
import RouteTitle from "./components/RouteTitle";
import PageLoader from "./components/PageLoader";
import Header from "./components/Header";

// Code splitting por rota: cada pagina vira um chunk carregado sob demanda,
// reduzindo o JavaScript do carregamento inicial.
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const RecuperarSenha = lazy(() => import("./pages/RecuperarSenha"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Chamados = lazy(() => import("./pages/Chamados"));
const OrdensServico = lazy(() => import("./pages/OrdensServico"));
const NovaOrdemServico = lazy(() => import("./pages/NovaOrdemServico"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Empresas = lazy(() => import("./pages/Empresas"));
const Profissionais = lazy(() => import("./pages/Profissionais"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

/*
 * Arvore da aplicacao: providers globais, roteamento e fronteira de erro.
 * Separada de main.jsx (que apenas faz o bootstrap) para deixar o ponto de
 * entrada enxuto e o fast-refresh funcionar.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <BrowserRouter>
            <AuthProvider>
              <ToastProvider>
                  <RouteTitle />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Rotas publicas */}
                      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                      <Route path="/cadastro" element={<PublicLayout><Cadastro /></PublicLayout>} />
                      <Route path="/recuperar-senha" element={<PublicLayout><RecuperarSenha /></PublicLayout>} />
                      <Route path="/abrir-chamado" element={<Navigate to="/" replace />} />
                      <Route path="/sobre" element={<PublicLayout><Sobre /></PublicLayout>} />

                      {/* Rotas privadas */}
                      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                      <Route path="/chamados" element={<PrivateRoute><Chamados /></PrivateRoute>} />
                      <Route path="/ordens-servico" element={<PrivateRoute><OrdensServico /></PrivateRoute>} />
                      <Route path="/ordens-servico/nova" element={<PrivateRoute><NovaOrdemServico /></PrivateRoute>} />
                      <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
                      <Route path="/empresas" element={<PrivateRoute><Empresas /></PrivateRoute>} />
                      <Route path="/profissionais" element={<PrivateRoute><Profissionais /></PrivateRoute>} />

                      {/* 404 - rota nao encontrada */}
                      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
                    </Routes>
                  </Suspense>
              </ToastProvider>
            </AuthProvider>
          </BrowserRouter>
        </AccessibilityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
