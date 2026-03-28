import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Modal from "../components/Modal";
import {
  Eye, Wrench, Trash2, Inbox, ChevronRight, ChevronLeft,
  AlertCircle, Minus, ArrowDown,
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

function SkeletonRows({ cols }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      {Array.from({ length: cols }).map((_, j) => (
        <td key={j} style={{ padding: "13px 16px" }}>
          <div style={{
            background: "var(--surface-3)",
            borderRadius: "var(--radius-sm)",
            height: 14,
            width: "80%",
            animation: `skeletonPulse 1.4s ease infinite`,
            animationDelay: `${0.1 * i}s`,
          }} />
        </td>
      ))}
    </tr>
  ));
}

function GhostBtn({ icon: Icon, title, hoverColor, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: "transparent",
        color: "var(--text-2)",
        border: "none",
        padding: 6,
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        transition: "var(--transition)",
        display: "inline-flex",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-2)"; }}
    >
      <Icon size={15} />
    </button>
  );
}

export default function Chamados() {
  const [chamados, setChamados] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    carregarChamados();
  }, []);

  async function carregarChamados() {
    setLoading(true);
    try {
      const res = await api.get("/chamados");
      setChamados(res.data);
    } catch {
      showToast("Erro ao carregar chamados", "error");
    } finally {
      setLoading(false);
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este chamado?")) return;
    try {
      await api.delete(`/chamados/${id}`);
      setChamados(chamados.filter((c) => c.id !== id));
      showToast("Chamado excluido com sucesso", "success");
    } catch {
      showToast("Erro ao excluir chamado", "error");
    }
  }

  function gerarOS(chamado) {
    navigate("/ordens-servico/nova", { state: { chamado } });
  }

  const totalPages = Math.max(1, Math.ceil(chamados.length / perPage));
  const paginated = chamados.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
            Dashboard <ChevronRight size={12} /> Chamados
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)" }}>Chamados</h1>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["ID", "Data", "Local", "Descricao", "Prioridade", "Solicitante", "Acoes"].map((h) => (
                  <th key={h} style={{
                    fontSize: 11, fontWeight: 600, color: "var(--text-3)",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    padding: "12px 16px", textAlign: "left",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRows cols={7} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-2)" }}>
                      Nenhum registro encontrado
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>
                      Os chamados aparecerao aqui quando forem abertos
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
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{c.id}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{c.data}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{c.local}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.descricao}</td>
                  <td style={{ padding: "13px 16px" }}><PriorityBadge value={c.prioridade} /></td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{c.solicitante}</td>
                  <td style={{ padding: "13px 16px", display: "flex", gap: 4 }}>
                    <GhostBtn icon={Eye} title="Ver chamado" hoverColor="var(--primary)" onClick={() => setSelecionado(c)} />
                    <GhostBtn icon={Wrench} title="Gerar OS" hoverColor="var(--normal)" onClick={() => gerarOS(c)} />
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => excluir(c.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && chamados.length > 0 && (
          <div style={{
            background: "var(--surface-2)",
            borderTop: "1px solid var(--border)",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              Mostrando {paginated.length} de {chamados.length} registros
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  background: "var(--surface-3)", color: "var(--text-1)",
                  border: "1px solid var(--border)", padding: "4px 10px",
                  borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
                  opacity: page === 1 ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4,
                }}
              >
                <ChevronLeft size={12} /> Anterior
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                style={{
                  background: "var(--surface-3)", color: "var(--text-1)",
                  border: "1px solid var(--border)", padding: "4px 10px",
                  borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
                  opacity: page === totalPages ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4,
                }}
              >
                Proximo <ChevronRight size={12} />
              </button>
            </div>
          </div>
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
              borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 500, cursor: "pointer",
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
              ["Descricao", selecionado.descricao],
              ["Prioridade", selecionado.prioridade],
              ["Solicitante", selecionado.solicitante],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: "var(--text-1)" }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
