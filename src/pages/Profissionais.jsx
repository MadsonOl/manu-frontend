import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Modal from "../components/Modal";
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

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [funcao, setFuncao] = useState("");
  const [erro, setErro] = useState("");
  const [modalFuncao, setModalFuncao] = useState(false);
  const [novaFuncao, setNovaFuncao] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { showToast } = useToast();

  useEffect(() => {
    carregarProfissionais();
    carregarFuncoes();
  }, []);

  async function carregarProfissionais() {
    setLoading(true);
    try {
      const res = await api.get("/profissionais");
      setProfissionais(res.data);
    } catch {
      showToast("Erro ao carregar profissionais", "error");
    } finally {
      setLoading(false);
    }
  }

  async function carregarFuncoes() {
    try {
      const res = await api.get("/funcoes");
      setFuncoes(res.data);
    } catch {
      /* API offline */
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      await api.post("/profissionais", { nome, telefone, email, rg, cpf, funcao });
      setNome(""); setTelefone(""); setEmail(""); setRg(""); setCpf(""); setFuncao("");
      carregarProfissionais();
      showToast("Profissional cadastrado com sucesso", "success");
    } catch {
      setErro("Erro ao cadastrar profissional");
      showToast("Erro ao cadastrar profissional", "error");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este profissional?")) return;
    try {
      await api.delete(`/profissionais/${id}`);
      setProfissionais(profissionais.filter((p) => p.id !== id));
      showToast("Profissional excluido com sucesso", "success");
    } catch {
      showToast("Erro ao excluir profissional", "error");
    }
  }

  async function salvarFuncao() {
    if (!novaFuncao.trim()) return;
    try {
      await api.post("/funcoes", { nome: novaFuncao });
      setNovaFuncao("");
      setModalFuncao(false);
      carregarFuncoes();
      showToast("Funcao cadastrada com sucesso", "success");
    } catch {
      showToast("Erro ao cadastrar funcao", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(profissionais.length / perPage));
  const paginated = profissionais.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
            Dashboard <ChevronRight size={12} /> Profissionais
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)" }}>Profissionais</h1>
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
              <label style={labelStyle}>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>Telefone</label>
              <input value={telefone} onChange={(e) => setTelefone(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>RG</label>
              <input value={rg} onChange={(e) => setRg(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>CPF</label>
              <input value={cpf} onChange={(e) => setCpf(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>Funcao</label>
              <select value={funcao} onChange={(e) => setFuncao(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
                <option value="">Selecione uma funcao</option>
                {funcoes.map((f) => (
                  <option key={f.id} value={f.nome}>{f.nome}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
            <button type="submit" style={{
              background: "var(--primary)", color: "#fff",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer",
              transition: "var(--transition)", display: "flex", alignItems: "center", gap: 6,
            }}>
              <Plus size={15} />
              Cadastrar
            </button>
            <button type="button" onClick={() => setModalFuncao(true)} style={{
              background: "transparent", color: "var(--text-2)",
              border: "none", fontSize: 13, cursor: "pointer",
              transition: "var(--transition)",
            }}>
              Cadastrar nova funcao
            </button>
          </div>
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
                {["ID", "Nome", "Telefone", "E-mail", "RG", "CPF", "Funcao", "Acoes"].map((h) => (
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
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-2)" }}>Nenhum profissional cadastrado</div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Use o formulario acima para cadastrar</div>
                  </td>
                </tr>
              ) : paginated.map((p, i) => (
                <tr key={p.id} style={{
                  borderBottom: i < paginated.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  transition: "var(--transition)",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{p.id}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{p.nome}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{p.telefone}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{p.email}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{p.rg}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{p.cpf}</td>
                  <td style={{ fontSize: 13, color: "var(--text-1)", padding: "13px 16px" }}>{p.funcao}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => excluir(p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && profissionais.length > 0 && (
          <div style={{
            background: "var(--surface-2)", borderTop: "1px solid var(--border)",
            padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              Mostrando {paginated.length} de {profissionais.length} registros
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

      {/* Modal Nova Funcao */}
      <Modal
        isOpen={modalFuncao}
        onClose={() => setModalFuncao(false)}
        title="Cadastrar Nova Funcao"
        footer={
          <>
            <button onClick={() => setModalFuncao(false)} style={{
              background: "var(--surface-3)", color: "var(--text-1)",
              border: "1px solid var(--border)", padding: "8px 16px",
              borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>Cancelar</button>
            <button onClick={salvarFuncao} style={{
              background: "var(--primary)", color: "#fff",
              border: "none", padding: "8px 16px",
              borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>Salvar</button>
          </>
        }
      >
        <div>
          <label style={labelStyle}>Nome da funcao</label>
          <input value={novaFuncao} onChange={(e) => setNovaFuncao(e.target.value)}
            style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
        </div>
      </Modal>
    </div>
  );
}
