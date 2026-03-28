import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import AbrirChamado from "./pages/AbrirChamado";
import Sobre from "./pages/Sobre";
import Dashboard from "./pages/Dashboard";
import Chamados from "./pages/Chamados";
import OrdensServico from "./pages/OrdensServico";
import NovaOrdemServico from "./pages/NovaOrdemServico";
import Relatorios from "./pages/Relatorios";
import Empresas from "./pages/Empresas";
import Profissionais from "./pages/Profissionais";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/abrir-chamado" element={<AbrirChamado />} />
          <Route path="/sobre" element={<Sobre />} />

          {/* Rotas privadas */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/chamados" element={<PrivateRoute><Chamados /></PrivateRoute>} />
          <Route path="/ordens-servico" element={<PrivateRoute><OrdensServico /></PrivateRoute>} />
          <Route path="/ordens-servico/nova" element={<PrivateRoute><NovaOrdemServico /></PrivateRoute>} />
          <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
          <Route path="/empresas" element={<PrivateRoute><Empresas /></PrivateRoute>} />
          <Route path="/profissionais" element={<PrivateRoute><Profissionais /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
