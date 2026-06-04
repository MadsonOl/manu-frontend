import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Modal from "./Modal";
import AccessibilityMenu from "./AccessibilityMenu";
import { ArrowLeft, LogOut, LogIn } from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/chamados": "Chamados",
  "/ordens-servico": "Ordens de Servico",
  "/ordens-servico/nova": "Nova Ordem de Servico",
  "/relatorios": "Relatorios",
  "/empresas": "Empresas",
  "/profissionais": "Profissionais",
};

/*
 * Destino do botao "Voltar": um nivel logico acima de cada rota, em vez do
 * historico do navegador (navigate(-1)). Assim sair do painel do gestor leva
 * direto ao topo (subpagina -> Dashboard -> inicio), sem precisar desfazer cada
 * navegacao visitada.
 */
const rotaPai = {
  "/login": "/",
  "/cadastro": "/login",
  "/recuperar-senha": "/login",
  "/sobre": "/",
  "/dashboard": "/",
  "/chamados": "/dashboard",
  "/ordens-servico": "/dashboard",
  "/ordens-servico/nova": "/ordens-servico",
  "/relatorios": "/dashboard",
  "/empresas": "/dashboard",
  "/profissionais": "/dashboard",
};

export default function Header({ variant = "public" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverGestor, setHoverGestor] = useState(false);

  const isPrivate = variant === "private";
  const isLogin = location.pathname === "/login";
  const title = pageTitles[location.pathname] || "";

  function handleBack() {
    const pai = rotaPai[location.pathname];
    if (pai) {
      navigate(pai);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  async function handleLogout() {
    // Mesmo se o signOut falhar, fechamos o dialogo e seguimos para a home.
    try {
      await logout();
    } catch {
      /* ignora: o fluxo segue para a home de qualquer forma */
    }
    setShowLogout(false);
    navigate("/");
  }

  return (
    <>
      <header
        className={isPrivate ? "app-header app-header--privada" : "app-header"}
        style={{
          height: 56,
          background: "var(--surface-1)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          position: "sticky",
          top: 0,
          zIndex: 90,
        }}
      >
        {/* Left — back button */}
        <button
          onClick={handleBack}
          onMouseEnter={() => setHoverBack(true)}
          onMouseLeave={() => setHoverBack(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: hoverBack ? "var(--surface-hover)" : "transparent",
            border: "none",
            color: "var(--text-2)",
            fontSize: "var(--fs-13)",
            fontWeight: 500,
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "var(--radius-md)",
            transition: "var(--transition)",
          }}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        {/* Center — page title (only on private pages; oculto no mobile) */}
        {isPrivate && title && (
          <span className="app-header__titulo" style={{
            fontSize: "var(--fs-15)",
            fontWeight: 600,
            color: "var(--text-1)",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}>
            {title}
          </span>
        )}

        {/* Right — controle de acessibilidade (sempre visivel) + acao da pagina */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AccessibilityMenu />
          {isPrivate ? (
            <button
              onClick={() => setShowLogout(true)}
              onMouseEnter={() => setHoverLogout(true)}
              onMouseLeave={() => setHoverLogout(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: hoverLogout ? "var(--alta-bg)" : "transparent",
                border: "none",
                color: hoverLogout ? "var(--alta)" : "var(--text-2)",
                fontSize: "var(--fs-13)",
                fontWeight: 500,
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: "var(--radius-md)",
                transition: "var(--transition)",
              }}
            >
              <LogOut size={16} />
              Sair
            </button>
          ) : !isLogin ? (
            <button
              onClick={() => navigate("/login")}
              onMouseEnter={() => setHoverGestor(true)}
              onMouseLeave={() => setHoverGestor(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: hoverGestor ? "var(--primary-dark)" : "var(--primary-strong)",
                border: "none",
                color: "#fff",
                fontSize: "var(--fs-13)",
                fontWeight: 600,
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                transition: "var(--transition)",
              }}
            >
              <LogIn size={16} />
              Acesso Gestor
            </button>
          ) : null}
        </div>
      </header>

      {/* Logout confirmation modal (only relevant for private) */}
      {isPrivate && (
        <Modal
          isOpen={showLogout}
          onClose={() => setShowLogout(false)}
          title="Sair da plataforma"
          footer={
            <>
              <button
                onClick={() => setShowLogout(false)}
                style={{
                  background: "var(--surface-3)",
                  color: "var(--text-1)",
                  border: "1px solid var(--border)",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--fs-13)",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: "var(--danger-strong)",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--fs-13)",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "var(--transition)",
                }}
              >
                <LogOut size={15} />
                Sair
              </button>
            </>
          }
        >
          <div style={{ textAlign: "center" }}>
            <LogOut size={32} style={{ color: "var(--text-2)", marginBottom: 16 }} />
            <p style={{ fontSize: "var(--fs-14)", color: "var(--text-2)" }}>
              Tem certeza que deseja encerrar sua sessao?
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
