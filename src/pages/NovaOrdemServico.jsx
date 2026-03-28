import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { ChevronRight, Save, ArrowLeft, Loader2 } from "lucide-react";

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

function handleFocus(e) {
  e.target.style.borderColor = "var(--primary)";
  e.target.style.boxShadow = "0 0 0 3px var(--primary-ring)";
}
function handleBlur(e) {
  e.target.style.borderColor = "var(--border)";
  e.target.style.boxShadow = "none";
}

export default function NovaOrdemServico() {
  const location = useLocation();
  const navigate = useNavigate();
  const chamado = location.state?.chamado || {};
  const { showToast } = useToast();

  const [local, setLocal] = useState(chamado.local || "");
  const [descricao, setDescricao] = useState(chamado.descricao || "");
  const [prioridade, setPrioridade] = useState(chamado.prioridade || "NORMAL");
  const [solicitante, setSolicitante] = useState(chamado.solicitante || "");
  const [responsavel, setResponsavel] = useState("");
  const [profissionais, setProfissionais] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/profissionais")
      .then((res) => setProfissionais(res.data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await api.post("/ordens-servico", {
        local,
        descricao,
        prioridade,
        solicitante,
        profissional: responsavel,
        chamado_id: chamado.id || null,
      });
      showToast("Ordem de servico criada com sucesso", "success");
      navigate("/ordens-servico");
    } catch {
      setErro("Erro ao cadastrar ordem de servico");
      showToast("Erro ao cadastrar OS", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
          Dashboard <ChevronRight size={12} /> Ordens de Servico <ChevronRight size={12} /> Nova
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-1)" }}>Nova Ordem de Servico</h1>
      </div>

      {/* Form Card */}
      <div style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        maxWidth: 560,
      }}>
        {erro && (
          <div style={{
            background: "var(--alta-bg)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            fontSize: 13,
            color: "var(--alta)",
            marginBottom: 16,
          }}>{erro}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Local</label>
            <input value={local} onChange={(e) => setLocal(e.target.value)} required
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Descricao</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Prioridade</label>
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="BAIXA">BAIXA</option>
              <option value="NORMAL">NORMAL</option>
              <option value="ALTA">ALTA</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Solicitante</label>
            <input value={solicitante} onChange={(e) => setSolicitante(e.target.value)} required
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Responsavel</label>
            <select value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">Selecione um profissional</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.nome}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={loading} style={{
              background: "var(--primary)", color: "#fff",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "var(--transition)",
              display: "flex", alignItems: "center", gap: 6,
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} />}
              Cadastrar OS
            </button>
            <button type="button" onClick={() => navigate(-1)} style={{
              background: "var(--surface-3)", color: "var(--text-1)",
              border: "1px solid var(--border)",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "var(--transition)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <ArrowLeft size={15} />
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
