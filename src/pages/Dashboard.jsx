import { useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useApiData } from "../hooks/useApiData";
import Breadcrumb from "../components/ui/Breadcrumb";
import ColdStartBanner from "../components/ui/ColdStartBanner";
import {
  ClipboardList, Wrench, BarChart2, Building2, HardHat,
  ChevronRight, Clock, CheckCircle,
} from "lucide-react";

const modules = [
  { icon: ClipboardList, label: "Chamados", desc: "Visualize e gerencie os chamados abertos", rota: "/chamados" },
  { icon: Wrench, label: "Ordens de Serviço", desc: "Acompanhe e finalize as ordens em andamento", rota: "/ordens-servico" },
  { icon: BarChart2, label: "Relatórios", desc: "Gere relatórios filtrados das ordens de serviço", rota: "/relatorios" },
  { icon: Building2, label: "Empresas", desc: "Gerencie os dados das empresas cadastradas", rota: "/empresas" },
  { icon: HardHat, label: "Profissionais", desc: "Cadastre e gerencie os técnicos responsáveis", rota: "/profissionais" },
];

const statCards = [
  { key: "chamados", label: "Chamados", icon: ClipboardList, color: "var(--primary)" },
  { key: "ordensAtendimento", label: "OS em Atendimento", icon: Clock, color: "var(--atendimento)" },
  { key: "ordensFinalizado", label: "OS Finalizadas", icon: CheckCircle, color: "var(--finalizado)" },
  { key: "profissionais", label: "Profissionais", icon: HardHat, color: "var(--primary)" },
];

export default function Dashboard() {
  // Cada chamada tem seu proprio catch para que uma falha isolada nao zere todo
  // o painel; o cartao apenas mostra 0. O hook ainda sinaliza cold start (slow).
  const carregarStats = useCallback(async () => {
    const [chamRes, osRes, profRes] = await Promise.all([
      api.get("/chamados").catch(() => ({ data: [] })),
      api.get("/ordens-servico").catch(() => ({ data: [] })),
      api.get("/profissionais").catch(() => ({ data: [] })),
    ]);
    const ordens = osRes.data;
    return {
      chamados: chamRes.data.length,
      ordensAtendimento: ordens.filter((o) => o.status !== "FINALIZADO").length,
      ordensFinalizado: ordens.filter((o) => o.status === "FINALIZADO").length,
      profissionais: profRes.data.length,
    };
  }, []);
  const { data: stats, loading: loadingStats, slow } = useApiData(carregarStats);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb items={[{ label: "Dashboard" }]} />
        <h1 style={{ fontSize: "var(--fs-24)", fontWeight: 700, color: "var(--text-1)" }}>
          Dashboard
        </h1>
      </div>

      {/* Aviso de cold start durante carregamento demorado */}
      {loadingStats && slow && <ColdStartBanner />}

      {/* Stats */}
      <div className="stats-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}>
        {statCards.map((s, i) => (
          <div key={s.key} style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
            animation: `fadeIn 0.3s ease ${0.05 * i}s backwards`,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}>
              <span style={{ fontSize: "var(--fs-12)", color: "var(--text-3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {s.label}
              </span>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `${s.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            {loadingStats ? (
              <div style={{
                height: 32, width: 60, borderRadius: "var(--radius-sm)",
                background: "var(--surface-3)",
                animation: "skeletonPulse 1.4s ease infinite",
              }} />
            ) : (
              <div style={{ fontSize: "var(--fs-28)", fontWeight: 700, color: "var(--text-1)" }}>
                {stats?.[s.key] ?? 0}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Grid */}
      <div className="modules-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
      }}>
        {modules.map((m, i) => (
          // Cartao de navegacao como Link real: foco por teclado e ativacao
          // com Enter, alem do clique (WCAG 2.1.1 / 2.4.7).
          <Link
            key={m.label}
            to={m.rota}
            style={{
              display: "block",
              textDecoration: "none",
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
            <h3 style={{ fontSize: "var(--fs-15)", fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
              {m.label}
            </h3>
            <p style={{ fontSize: "var(--fs-13)", color: "var(--text-2)", lineHeight: 1.5 }}>
              {m.desc}
            </p>
            <ChevronRight size={16} style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              color: "var(--text-3)",
            }} />
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .modules-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .modules-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
