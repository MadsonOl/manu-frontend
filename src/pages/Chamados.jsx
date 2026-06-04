import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useChamados, useExcluirChamado } from "../hooks/useChamados";
import { useSlowHint } from "../hooks/useSlowHint";
import Modal from "../components/Modal";
import Breadcrumb from "../components/ui/Breadcrumb";
import { PriorityBadge } from "../components/ui/Badge";
import { SkeletonRows, GhostBtn, thStyle, tdStyle } from "../components/ui/TableUtils";
import Pagination from "../components/ui/Pagination";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorState from "../components/ui/ErrorState";
import ColdStartBanner from "../components/ui/ColdStartBanner";
import { selectStyle } from "../components/ui/InputStyles";
import {
  Eye, Wrench, Trash2, Inbox, Filter, Search,
} from "lucide-react";

export default function Chamados() {
  const { data, isLoading, isError, error, refetch } = useChamados();
  const chamados = data ?? [];
  const slow = useSlowHint(isLoading);
  const excluirChamado = useExcluirChamado();

  const [selecionado, setSelecionado] = useState(null);
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const perPage = 10;
  const navigate = useNavigate();
  const { showToast } = useToast();

  function excluir(id) {
    excluirChamado.mutate(id, {
      onSuccess: () => showToast("Chamado excluído com sucesso", "success"),
      onError: (e) => showToast(e.message, "error"),
    });
  }

  function gerarOS(chamado) {
    navigate("/ordens-servico/nova", { state: { chamado } });
  }

  const chamadosFiltrados = chamados.filter((c) => {
    if (filtroPrioridade && c.prioridade !== filtroPrioridade) return false;
    if (filtroData && c.data !== filtroData) return false;
    if (busca) {
      const term = busca.toLowerCase();
      if (
        !c.descricao?.toLowerCase().includes(term) &&
        !c.local?.toLowerCase().includes(term) &&
        !c.solicitante?.toLowerCase().includes(term)
      ) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(chamadosFiltrados.length / perPage));
  const paginated = chamadosFiltrados.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Breadcrumb items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Chamados" },
          ]} />
          <h1 style={{ fontSize: "var(--fs-24)", fontWeight: 700, color: "var(--text-1)" }}>Chamados</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{
        display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center",
      }}>
        <Filter size={14} style={{ color: "var(--text-3)" }} />
        <div style={{ position: "relative" }}>
          <Search size={13} style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-3)",
          }} />
          <input
            type="text"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(1); }}
            placeholder="Buscar..."
            style={{ ...selectStyle, paddingLeft: 30, minWidth: 180 }}
          />
        </div>
        <select
          value={filtroPrioridade}
          onChange={(e) => { setFiltroPrioridade(e.target.value); setPage(1); }}
          style={selectStyle}
        >
          <option value="">Todas prioridades</option>
          <option value="ALTA">Alta</option>
          <option value="NORMAL">Normal</option>
          <option value="BAIXA">Baixa</option>
        </select>
        <input
          type="date"
          value={filtroData}
          onChange={(e) => { setFiltroData(e.target.value); setPage(1); }}
          style={{ ...selectStyle, colorScheme: "dark" }}
        />
      </div>

      {/* Aviso de cold start durante carregamento demorado */}
      {isLoading && slow && <ColdStartBanner />}

      {/* Table */}
      <div style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table className="reflow-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["ID", "Data", "Local", "Descrição", "Prioridade", "Solicitante", "Ações"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isError ? (
                <tr>
                  <td colSpan="7"><ErrorState message={error.message} onRetry={refetch} /></td>
                </tr>
              ) : isLoading ? <SkeletonRows cols={7} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    <div style={{ fontSize: "var(--fs-14)", fontWeight: 500, color: "var(--text-2)" }}>
                      Nenhum registro encontrado
                    </div>
                    <div style={{ fontSize: "var(--fs-13)", color: "var(--text-3)", marginTop: 4 }}>
                      Os chamados aparecerão aqui quando forem abertos
                    </div>
                  </td>
                </tr>
              ) : paginated.map((c, i) => (
                <tr key={c.id} style={{
                  borderBottom: i < paginated.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  transition: "var(--transition)",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={tdStyle} data-label="ID">{c.id}</td>
                  <td style={tdStyle} data-label="Data">{c.data}</td>
                  <td style={tdStyle} data-label="Local">{c.local}</td>
                  <td style={{ ...tdStyle, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} data-label="Descrição">{c.descricao}</td>
                  <td style={{ padding: "13px 16px" }} data-label="Prioridade"><PriorityBadge value={c.prioridade} /></td>
                  <td style={tdStyle} data-label="Solicitante">{c.solicitante}</td>
                  <td style={{ padding: "13px 16px", display: "flex", gap: 4 }} data-label="Ações">
                    <GhostBtn icon={Eye} title="Ver chamado" hoverColor="var(--primary)" onClick={() => setSelecionado(c)} />
                    <GhostBtn icon={Wrench} title="Gerar OS" hoverColor="var(--normal)" onClick={() => gerarOS(c)} />
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => setConfirmDelete(c.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !isError && chamadosFiltrados.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={chamadosFiltrados.length}
            showing={paginated.length}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selecionado}
        onClose={() => setSelecionado(null)}
        title={`Chamado #${selecionado?.id}`}
        footer={
          <button
            onClick={() => setSelecionado(null)}
            style={{
              background: "var(--surface-3)", color: "var(--text-1)",
              border: "1px solid var(--border)", padding: "8px 16px",
              borderRadius: "var(--radius-md)", fontSize: "var(--fs-13)", fontWeight: 500, cursor: "pointer",
            }}
          >
            Fechar
          </button>
        }
      >
        {selecionado && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Data", selecionado.data],
              ["Local", selecionado.local],
              ["Descrição", selecionado.descricao],
              ["Prioridade", selecionado.prioridade],
              ["Solicitante", selecionado.solicitante],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: "var(--fs-12)", fontWeight: 500, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: "var(--fs-14)", color: "var(--text-1)" }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => excluir(confirmDelete)}
        message="Deseja excluir este chamado? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
