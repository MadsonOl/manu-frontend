import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Breadcrumb from "../components/ui/Breadcrumb";
import { PriorityBadge, StatusBadge } from "../components/ui/Badge";
import { SkeletonRows, thStyle, tdStyle } from "../components/ui/TableUtils";
import Pagination from "../components/ui/Pagination";
import { selectStyle } from "../components/ui/InputStyles";
import { Printer, Inbox, Filter } from "lucide-react";

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
    api.get("/ordens-servico")
      .then((res) => setOrdens(res.data))
      .catch(() => showToast("Erro ao carregar relatórios", "error"))
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
          <Breadcrumb items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Relatórios" },
          ]} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)" }}>Relatórios</h1>
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
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-dark)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--primary)"}
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
                {["ID", "Data", "Local", "Descrição", "Prioridade", "Solicitante", "Profissional", "Status"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
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
                  <td style={tdStyle}>{o.id}</td>
                  <td style={tdStyle}>{o.data}</td>
                  <td style={tdStyle}>{o.local}</td>
                  <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.descricao}</td>
                  <td style={{ padding: "13px 16px" }}><PriorityBadge value={o.prioridade} /></td>
                  <td style={tdStyle}>{o.solicitante}</td>
                  <td style={tdStyle}>{o.profissional}</td>
                  <td style={{ padding: "13px 16px" }}><StatusBadge value={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && ordensFiltradas.length > 0 && (
          <div className="no-print">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={ordensFiltradas.length}
              showing={paginated.length}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
