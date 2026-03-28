import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Wrench, MapPin, FileText, AlertCircle, User, Send,
  CheckCircle, Plus, Loader2, LogIn,
} from "lucide-react";

const dotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='white' opacity='0.03'/%3E%3C/svg%3E")`;

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

export default function Home() {
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("NORMAL");
  const [solicitante, setSolicitante] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso(false);
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/chamados`, {
        local,
        descricao,
        prioridade,
        solicitante,
      });
      setSucesso(true);
      setLocal(""); setDescricao(""); setPrioridade("NORMAL"); setSolicitante("");
    } catch {
      setErro("Erro ao abrir chamado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      backgroundImage: dotPattern,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
    }}>
      {/* Botao Acesso gestor — canto superior direito */}
      <Link to="/login" style={{
        position: "absolute",
        top: 16,
        right: 20,
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 4,
        color: "var(--text-3)",
        fontSize: 12,
        padding: "5px 10px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        transition: "var(--transition)",
        background: "transparent",
      }}>
        <LogIn size={12} />
        Acesso gestor
      </Link>

      {/* Logo centralizado */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
        animation: "fadeIn 0.3s ease",
      }}>
        <Wrench size={18} style={{ color: "var(--primary)" }} />
        <span style={{ fontWeight: 700, fontSize: 24, color: "var(--primary)" }}>manu</span>
      </div>

      <div style={{
        fontSize: 13,
        color: "var(--text-3)",
        marginBottom: 32,
        animation: "fadeIn 0.3s ease",
      }}>
        Registre sua solicitacao de manutencao
      </div>

      {/* Card do formulario */}
      <div style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: 40,
        maxWidth: 420,
        width: "100%",
        boxShadow: "var(--shadow-lg)",
        animation: "fadeIn 0.4s ease 0.1s backwards",
      }}>
        {sucesso && (
          <div style={{
            background: "var(--finalizado-bg)",
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: "var(--radius-md)",
            padding: 14,
            fontSize: 13,
            color: "var(--finalizado)",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <CheckCircle size={18} />
            Chamado aberto com sucesso!
          </div>
        )}

        {erro && (
          <div style={{
            background: "var(--alta-bg)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            fontSize: 13,
            color: "var(--alta)",
            marginBottom: 16,
          }}>
            {erro}
          </div>
        )}

        {!sucesso ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Local</label>
              <input value={local} onChange={(e) => setLocal(e.target.value)} required
                placeholder="Ex: Bloco A, Sala 101"
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Descricao</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required
                placeholder="Descreva o problema..."
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
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Solicitante</label>
              <input value={solicitante} onChange={(e) => setSolicitante(e.target.value)} required
                placeholder="Seu nome"
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%",
              background: "var(--primary)", color: "#fff",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "var(--transition)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={15} />}
              Enviar chamado
            </button>
          </form>
        ) : (
          <button onClick={() => setSucesso(false)} style={{
            width: "100%",
            background: "var(--surface-3)", color: "var(--text-1)",
            border: "1px solid var(--border)",
            padding: "8px 16px", borderRadius: "var(--radius-md)",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "var(--transition)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Plus size={15} />
            Abrir novo chamado
          </button>
        )}
      </div>

      {/* Link discreto para /sobre */}
      <Link to="/sobre" style={{
        marginTop: 24,
        fontSize: 12,
        color: "var(--text-3)",
        textDecoration: "none",
        transition: "var(--transition)",
        animation: "fadeIn 0.4s ease 0.2s backwards",
      }}>
        Saiba mais sobre o manu
      </Link>
    </div>
  );
}
