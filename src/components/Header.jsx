import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Modal from "./Modal";
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
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  async function handleLogout() {
    await logout();
    setShowLogout(false);
    navigate("/");
  }

  return (
    <>
      <header style={{
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
      }}>
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
            fontSize: 13,
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

        {/* Center — page title (only on private pages) */}
        {isPrivate && title && (
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text-1)",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}>
            {title}
          </span>
        )}

        {/* Right */}
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
              fontSize: 13,
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
              background: hoverGestor ? "var(--primary-dark)" : "var(--primary)",
              border: "none",
              color: "#fff",
              fontSize: 13,
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
        ) : (
          <div style={{ width: 80 }} />
        )}
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
                  fontSize: 13,
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
                  background: "var(--alta)",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
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
            <p style={{ fontSize: 14, color: "var(--text-2)" }}>
              Tem certeza que deseja encerrar sua sessao?
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
