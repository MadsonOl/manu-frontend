import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import Modal from "./Modal";
import {
  Wrench, Lightbulb, LayoutDashboard, ClipboardList, BarChart2,
  Building2, HardHat, LogOut, ChevronRight
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: ClipboardList, label: "Chamados", to: "/chamados" },
  { icon: Wrench, label: "Ordens de Serviço", to: "/ordens-servico" },
  { icon: BarChart2, label: "Relatórios", to: "/relatorios" },
  { icon: Building2, label: "Empresas", to: "/empresas" },
  { icon: HardHat, label: "Profissionais", to: "/profissionais" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navRef = useRef(null);

  // No mobile, o drawer aberto: trava a rolagem do fundo, fecha com Esc e
  // recebe o foco no primeiro item.
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    document.body.style.overflow = "hidden";
    navRef.current?.querySelector("a")?.focus();
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen, onClose]);

  async function handleLogout() {
    // Mesmo se o signOut falhar, encerramos a sessao local e seguimos para a
    // home - o usuario nunca fica preso por um erro de logout.
    try {
      await logout();
    } catch {
      /* ignora: navegacao abaixo encerra o fluxo de qualquer forma */
    }
    navigate("/");
  }

  const sidebarStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    width: 240,
    background: "var(--surface-1)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 12px",
    zIndex: 100,
    transition: "transform 0.2s ease",
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 99,
            display: "none",
          }}
          className="sidebar-overlay"
        />
      )}

      {/*
        Quando fora da tela no mobile (drawer fechado), a sidebar fica inerte:
        seus links nao recebem foco por teclado nem aparecem para leitores de
        tela. No desktop ela esta sempre visivel, entao nunca e inerte.
      */}
      <aside
        style={sidebarStyle}
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
        inert={isMobile && !isOpen ? true : undefined}
      >
        {/* Logo */}
        <div style={{
          paddingBottom: 20,
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lightbulb size={16} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: 700, fontSize: "var(--fs-18)", color: "var(--text-1)" }}>manu</span>
          </div>
          <div style={{ fontSize: "var(--fs-11)", color: "var(--text-3)", marginTop: 2, paddingLeft: 24 }}>
            Gestão de Manutenções
          </div>
        </div>

        {/* Nav */}
        <nav ref={navRef} aria-label="Navegacao principal" style={{ flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: isActive ? "8px 10px 8px 8px" : "8px 10px",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--fs-13)",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--primary)" : "var(--text-2)",
                textDecoration: "none",
                transition: "var(--transition)",
                marginBottom: 2,
                background: isActive ? "var(--primary-muted)" : "transparent",
                borderLeft: isActive ? "2px solid var(--primary)" : "2px solid transparent",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  e.currentTarget.style.background = "var(--surface-hover)";
                  e.currentTarget.style.color = "var(--text-1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-2)";
                  }
                }
              }}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: 16,
        }}>
          <div style={{
            fontSize: "var(--fs-12)",
            color: "var(--text-3)",
            marginBottom: 8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            paddingLeft: 10,
          }}>
            {usuario?.email}
          </div>
          <button
            onClick={() => setShowLogout(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 10px",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-13)",
              fontWeight: 500,
              color: "var(--text-2)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              justifyContent: "flex-start",
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--alta)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Logout confirmation modal */}
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
            Tem certeza que deseja encerrar sua sessão?
          </p>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
          .sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
