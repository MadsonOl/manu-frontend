import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import {
  Plus, Trash2, Inbox, ChevronRight, ChevronLeft,
} from "lucide-react";

const inputStyle = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-1)",
  padding: "9px 12px",
  borderRadius: "var(--radius-md)",
  fontSize: 14,
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "var(--transition)",
};

const labelStyle = {
  fontSize: 12, fontWeight: 500, color: "var(--text-2)",
  textTransform: "uppercase", letterSpacing: "0.06em",
  marginBottom: 6, display: "block",
};

function GhostBtn({ icon: Icon, title, hoverColor, onClick }) {
  return (
    <button title={title} onClick={onClick}
      style={{
        background: "transparent", color: "var(--text-2)",
        border: "none", padding: 6, borderRadius: "var(--radius-sm)",
        cursor: "pointer", transition: "var(--transition)", display: "inline-flex",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-2)"; }}
    >
      <Icon size={15} />
    </button>
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

function handleFocus(e) {
  e.target.style.borderColor = "var(--primary)";
  e.target.style.boxShadow = "0 0 0 3px var(--primary-ring)";
}
function handleBlur(e) {
  e.target.style.borderColor = "var(--border)";
  e.target.style.boxShadow = "none";
}

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [gestor, setGestor] = useState("");
  const [info, setInfo] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { showToast } = useToast();

  useEffect(() => {
    carregarEmpresas();
  }, []);

  async function carregarEmpresas() {
    setLoading(true);
    try {
      const res = await api.get("/empresas");
      setEmpresas(res.data);
    } catch {
      showToast("Erro ao carregar empresas", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      await api.post("/empresas", {
        cnpj,
        nome,
        endereco,
        gestor_manutencao: gestor,
        informacoes_adicionais: info,
      });
      setCnpj(""); setNome(""); setEndereco(""); setGestor(""); setInfo("");
      carregarEmpresas();
      showToast("Empresa cadastrada com sucesso", "success");
    } catch {
      setErro("Erro ao cadastrar empresa");
      showToast("Erro ao cadastrar empresa", "error");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir esta empresa?")) return;
    try {
      await api.delete(`/empresas/${id}`);
      setEmpresas(empresas.filter((e) => e.id !== id));
      showToast("Empresa excluida com sucesso", "success");
    } catch {
      showToast("Erro ao excluir empresa", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(empresas.length / perPage));
  const paginated = empresas.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
            Dashboard <ChevronRight size={12} /> Empresas
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)" }}>Empresas</h1>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 24,
      }}>
        {erro && (
          <div style={{
            background: "var(--alta-bg)", border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "var(--radius-md)", padding: "10px 14px",
            fontSize: 13, color: "var(--alta)", marginBottom: 16,
          }}>{erro}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>CNPJ</label>
              <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>Nome da Empresa</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>Endereco</label>
              <input value={endereco} onChange={(e) => setEndereco(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>Gestor de Manutencao</label>
              <input value={gestor} onChange={(e) => setGestor(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Informacoes Adicionais</label>
            <textarea value={info} onChange={(e) => setInfo(e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <button type="submit" style={{
            marginTop: 16,
            background: "var(--primary)", color: "#fff",
            padding: "8px 16px", borderRadius: "var(--radius-md)",
            fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer",
            transition: "var(--transition)", display: "flex", alignItems: "center", gap: 6,
          }}>
            <Plus size={15} />
            Cadastrar
          </button>
        </form>
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
                {["ID", "CNPJ", "Nome", "Endereco", "Gestor", "Acoes"].map((h) => (
                  <th key={h} style={{
                    fontSize: 11, fontWeight: 600, color: "var(--text-3)",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    padding: "12px 16px", textAlign: "left",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRows cols={6} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-2)" }}>Nenhuma empresa cadastrada</div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Use o formulario acima para cadastrar</div>
                  </td>
                </tr>
              ) : paginated.map((e, i) => (
                <tr key={e.id} style={{
                  borderBottom: i < paginated.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  transition: "var(--transition)",
                }}
                  onMouseEnter={(ev) => ev.currentTarget.style.background = "var(--surface-hover)"}
                  onMouseLeave={(ev) => ev.currentTarget.style.background = "transparent"}
                >
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{e.id}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{e.cnpj}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{e.nome}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{e.endereco}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{e.gestor_manutencao}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => excluir(e.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && empresas.length > 0 && (
          <div style={{
            background: "var(--surface-2)", borderTop: "1px solid var(--border)",
            padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              Mostrando {paginated.length} de {empresas.length} registros
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
