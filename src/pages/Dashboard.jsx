import { useNavigate } from "react-router-dom";
import {
  ClipboardList, Wrench, BarChart2, Building2, HardHat, Settings, ChevronRight
} from "lucide-react";

const modules = [
  { icon: ClipboardList, label: "Chamados", desc: "Visualize e gerencie os chamados abertos", rota: "/chamados" },
  { icon: Wrench, label: "Ordens de Servico", desc: "Acompanhe e finalize as ordens em andamento", rota: "/ordens-servico" },
  { icon: BarChart2, label: "Relatorios", desc: "Gere relatorios filtrados das ordens de servico", rota: "/relatorios" },
  { icon: Building2, label: "Empresas", desc: "Gerencie os dados das empresas cadastradas", rota: "/empresas" },
  { icon: HardHat, label: "Profissionais", desc: "Cadastre e gerencie os tecnicos responsaveis", rota: "/profissionais" },
  { icon: Settings, label: "Funcoes", desc: "Configure as funcoes dos profissionais", rota: "/profissionais" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8 }}>
          Dashboard
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)" }}>
          Dashboard
        </h1>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
      }}>
        {modules.map((m, i) => (
          <div
            key={m.label}
            onClick={() => navigate(m.rota)}
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 24,
              cursor: "pointer",
              transition: "var(--transition-slow)",
              position: "relative",
              animation: `fadeIn 0.3s ease ${0.05 * i}s backwards`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--primary-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}>
              <m.icon size={20} style={{ color: "var(--primary)" }} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
              {m.label}
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>
              {m.desc}
            </p>
            <ChevronRight size={16} style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              color: "var(--text-3)",
            }} />
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
