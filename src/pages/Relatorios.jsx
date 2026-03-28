import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import {
  Printer, ChevronRight, ChevronLeft, Inbox, Filter,
  AlertCircle, Minus, ArrowDown, Clock, CheckCircle,
} from "lucide-react";

function PriorityBadge({ value }) {
  const config = {
    ALTA: { bg: "var(--alta-bg)", color: "var(--alta)", icon: AlertCircle },
    NORMAL: { bg: "var(--normal-bg)", color: "var(--normal)", icon: Minus },
    BAIXA: { bg: "var(--baixa-bg)", color: "var(--baixa)", icon: ArrowDown },
  };
  const c = config[value] || config.NORMAL;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      <c.icon size={11} />
      {value}
    </span>
  );
}

function StatusBadge({ value }) {
  const isFinalizado = value === "FINALIZADO";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: isFinalizado ? "var(--finalizado-bg)" : "var(--atendimento-bg)",
      color: isFinalizado ? "var(--finalizado)" : "var(--atendimento)",
    }}>
      {isFinalizado ? <CheckCircle size={11} /> : <Clock size={11} style={{ animation: "pulse 2s ease infinite" }} />}
      {value}
    </span>
  );
}

function SkeletonRows({ cols }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      {Array.from({ length: cols }).map((_, j) => (
        <td key={j} style={{ padding: "13px 16px" }}>
          <div style={{
            background: "var(--surface-3)", borderRadius: "var(--radius-sm)",
            height: 14, width: "80%",
            animation: `skeletonPulse 1.4s ease infinite`,
            animationDelay: `${0.1 * i}s`,
          }} />
        </td>
      ))}
    </tr>
  ));
}

const selectStyle = {
  background: "var(--surface-2)", border: "1px solid var(--border)",
  color: "var(--text-1)", padding: "7px 12px", borderRadius: "var(--radius-md)",
  fontSize: 13, fontFamily: "var(--font-sans)", outline: "none",
};

export default function Relatorios() {
  const [ordens, setOrdens] = useState([]);
  const [filtroProfissional, setFiltroProfissional] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    api.get("/ordens-servico")
      .then((res) => setOrdens(res.data))
      .catch(() => showToast("Erro ao carregar relatorios", "error"))
      .finally(() => setLoading(false));
  }, []);

  const ordensFiltradas = ordens.filter((o) => {
    if (filtroProfissional && o.profissional !== filtroProfissional) return false;
    if (filtroStatus && o.status !== filtroStatus) return false;
    if (filtroData && o.data !== filtroData) return false;
    return true;
  });

  const profissionaisUnicos = [...new Set(ordens.map((o) => o.profissional).filter(Boolean))];
  const statusUnicos = [...new Set(ordens.map((o) => o.status).filter(Boolean))];

  const totalPages = Math.max(1, Math.ceil(ordensFiltradas.length / perPage));
  const paginated = ordensFiltradas.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
            Dashboard <ChevronRight size={12} /> Relatorios
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)" }}>Relatorios</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => window.print()}
            className="no-print"
            style={{
              background: "var(--primary)", color: "#fff",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer",
              transition: "var(--transition)", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Printer size={15} />
            Imprimir
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar no-print" style={{
        display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center",
      }}>
        <Filter size={14} style={{ color: "var(--text-3)" }} />
        <select value={filtroProfissional} onChange={(e) => { setFiltroProfissional(e.target.value); setPage(1); }} style={selectStyle}>
          <option value="">Todos profissionais</option>
          {profissionaisUnicos.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value); setPage(1); }} style={selectStyle}>
          <option value="">Todos status</option>
          {statusUnicos.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={filtroData} onChange={(e) => { setFiltroData(e.target.value); setPage(1); }}
          style={{ ...selectStyle, colorScheme: "dark" }}
        />
      </div>

      {/* Table */}
      <div style={{
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["ID", "Data", "Local", "Descricao", "Prioridade", "Solicitante", "Profissional", "Status"].map((h) => (
                  <th key={h} style={{
                    fontSize: 11, fontWeight: 600, color: "var(--text-3)",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    padding: "12px 16px", textAlign: "left",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRows cols={8} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-2)" }}>Nenhuma OS encontrada</div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Ajuste os filtros ou aguarde novas ordens</div>
                  </td>
                </tr>
              ) : paginated.map((o, i) => (
                <tr key={o.id} style={{
                  borderBottom: i < paginated.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  transition: "var(--transition)",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{o.id}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{o.data}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{o.local}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.descricao}</td>
                  <td style={{ padding: "13px 16px" }}><PriorityBadge value={o.prioridade} /></td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{o.solicitante}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{o.profissional}</td>
                  <td style={{ padding: "13px 16px" }}><StatusBadge value={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && ordensFiltradas.length > 0 && (
          <div className="no-print" style={{
            background: "var(--surface-2)", borderTop: "1px solid var(--border)",
            padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              Mostrando {paginated.length} de {ordensFiltradas.length} registros
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                style={{
                  background: "var(--surface-3)", color: "var(--text-1)",
                  border: "1px solid var(--border)", padding: "4px 10px",
                  borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
                  opacity: page === 1 ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4,
                }}>
                <ChevronLeft size={12} /> Anterior
              </button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                style={{
                  background: "var(--surface-3)", color: "var(--text-1)",
                  border: "1px solid var(--border)", padding: "4px 10px",
                  borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
                  opacity: page === totalPages ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4,
                }}>
                Proximo <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
