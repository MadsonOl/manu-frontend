import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useOrdens, useFinalizarOrdem, useExcluirOrdem } from "../hooks/useOrdens";
import { useSlowHint } from "../hooks/useSlowHint";
import Modal from "../components/Modal";
import Breadcrumb from "../components/ui/Breadcrumb";
import { PriorityBadge, StatusBadge } from "../components/ui/Badge";
import { SkeletonRows, GhostBtn, thStyle, tdStyle } from "../components/ui/TableUtils";
import Pagination from "../components/ui/Pagination";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorState from "../components/ui/ErrorState";
import ColdStartBanner from "../components/ui/ColdStartBanner";
import { selectStyle } from "../components/ui/InputStyles";
import {
  Eye, CheckSquare, Trash2, Inbox, Filter,
} from "lucide-react";

export default function OrdensServico() {
  const { data, isLoading, isError, error, refetch } = useOrdens();
  const ordens = data ?? [];
  const slow = useSlowHint(isLoading);
  const finalizarOrdem = useFinalizarOrdem();
  const excluirOrdem = useExcluirOrdem();

  const [selecionada, setSelecionada] = useState(null);
  const [filtroProfissional, setFiltroProfissional] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmFinalizar, setConfirmFinalizar] = useState(null);
  const perPage = 10;
  const { showToast } = useToast();

  function finalizar(id) {
    finalizarOrdem.mutate(id, {
      onSuccess: () => showToast("Ordem de serviço finalizada", "success"),
      onError: (e) => showToast(e.message, "error"),
    });
  }

  function excluir(id) {
    excluirOrdem.mutate(id, {
      onSuccess: () => showToast("Ordem de serviço excluída", "success"),
      onError: (e) => showToast(e.message, "error"),
    });
  }

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
  // Distingue lista vazia de "filtro sem resultado" para nao dar a impressao de
  // que nao ha dados quando, na verdade, basta limpar o filtro.
  const semResultadoPorFiltro = ordens.length > 0 && ordensFiltradas.length === 0;
  function limparFiltros() {
    setFiltroProfissional("");
    setFiltroStatus("");
    setFiltroData("");
    setPage(1);
  }

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Breadcrumb items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Ordens de Serviço" },
          ]} />
          <h1 style={{ fontSize: "var(--fs-24)", fontWeight: 700, color: "var(--text-1)" }}>Ordens de Serviço</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{
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

      {/* Aviso de cold start durante carregamento demorado */}
      {isLoading && slow && <ColdStartBanner />}

      {/* Table */}
      <div style={{
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table className="reflow-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["ID", "Data", "Local", "Descrição", "Prioridade", "Solicitante", "Profissional", "Empresa", "Status", "Ações"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isError ? (
                <tr>
                  <td colSpan="10"><ErrorState message={error.message} onRetry={refetch} /></td>
                </tr>
              ) : isLoading ? <SkeletonRows cols={10} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} aria-hidden="true" style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    {semResultadoPorFiltro ? (
                      <>
                        <div style={{ fontSize: "var(--fs-14)", fontWeight: 500, color: "var(--text-2)" }}>Nenhum resultado para os filtros aplicados</div>
                        <button onClick={limparFiltros} style={{
                          marginTop: 10, background: "none", border: "none",
                          color: "var(--primary)", cursor: "pointer", textDecoration: "underline",
                          fontSize: "var(--fs-13)",
                        }}>Limpar filtros</button>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "var(--fs-14)", fontWeight: 500, color: "var(--text-2)" }}>Nenhum registro encontrado</div>
                        <div style={{ fontSize: "var(--fs-13)", color: "var(--text-3)", marginTop: 4 }}>As ordens de serviço aparecerão aqui</div>
                      </>
                    )}
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
                  <td style={tdStyle} data-label="ID">{o.id}</td>
                  <td style={tdStyle} data-label="Data">{o.data}</td>
                  <td style={tdStyle} data-label="Local">{o.local}</td>
                  <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} data-label="Descrição">{o.descricao}</td>
                  <td style={{ padding: "13px 16px" }} data-label="Prioridade"><PriorityBadge value={o.prioridade} /></td>
                  <td style={tdStyle} data-label="Solicitante">{o.solicitante}</td>
                  <td style={tdStyle} data-label="Profissional">{o.profissional}</td>
                  <td style={tdStyle} data-label="Empresa">{o.empresa?.nome || "—"}</td>
                  <td style={{ padding: "13px 16px" }} data-label="Status"><StatusBadge value={o.status} /></td>
                  <td style={{ padding: "13px 16px", display: "flex", gap: 4 }} data-label="Ações">
                    <GhostBtn icon={Eye} title="Ver OS" hoverColor="var(--primary)" onClick={() => setSelecionada(o)} />
                    <GhostBtn icon={CheckSquare} title="Finalizar" hoverColor="var(--finalizado)" onClick={() => setConfirmFinalizar(o.id)} />
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => setConfirmDelete(o.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !isError && ordensFiltradas.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={ordensFiltradas.length}
            showing={paginated.length}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selecionada}
        onClose={() => setSelecionada(null)}
        title={`OS #${selecionada?.id}`}
        footer={
          <button onClick={() => setSelecionada(null)}
            style={{
              background: "var(--surface-3)", color: "var(--text-1)",
              border: "1px solid var(--border)", padding: "8px 16px",
              borderRadius: "var(--radius-md)", fontSize: "var(--fs-13)", fontWeight: 500, cursor: "pointer",
            }}>
            Fechar
          </button>
        }
      >
        {selecionada && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Data", selecionada.data],
              ["Local", selecionada.local],
              ["Descrição", selecionada.descricao],
              ["Prioridade", selecionada.prioridade],
              ["Solicitante", selecionada.solicitante],
              ["Profissional", selecionada.profissional],
              ["Status", selecionada.status],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: "var(--fs-12)", fontWeight: 500, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: "var(--fs-14)", color: "var(--text-1)" }}>{value}</div>
              </div>
            ))}

            {selecionada.empresa && (
              <>
                <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                <div style={{ fontSize: "var(--fs-13)", fontWeight: 600, color: "var(--text-2)" }}>Empresa</div>
                {[
                  ["Nome", selecionada.empresa.nome],
                  ["CNPJ", selecionada.empresa.cnpj],
                  ["Endereço", selecionada.empresa.endereco],
                  ["Gestor de Manutenção", selecionada.empresa.gestor_manutencao],
                ].map(([label, value]) => value ? (
                  <div key={label}>
                    <div style={{ fontSize: "var(--fs-12)", fontWeight: 500, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: "var(--fs-14)", color: "var(--text-1)" }}>{value}</div>
                  </div>
                ) : null)}
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => excluir(confirmDelete)}
        message="Deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita."
      />

      {/* Confirm Finalizar (acao irreversivel) */}
      <ConfirmDialog
        isOpen={!!confirmFinalizar}
        onClose={() => setConfirmFinalizar(null)}
        onConfirm={() => finalizar(confirmFinalizar)}
        title="Finalizar ordem de serviço"
        message="Deseja finalizar esta ordem de serviço? Esta ação não pode ser desfeita."
        confirmLabel="Finalizar"
        tone="warning"
      />
    </div>
  );
}
