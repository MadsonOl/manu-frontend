import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useProfissionais } from "../hooks/useProfissionais";
import { useEmpresas } from "../hooks/useEmpresas";
import { useCriarOrdem } from "../hooks/useOrdens";
import Breadcrumb from "../components/ui/Breadcrumb";
import { inputStyle, labelStyle, handleFocus, handleBlur } from "../components/ui/InputStyles";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

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
  const [empresaId, setEmpresaId] = useState(chamado.empresa_id || "");
  const [erro, setErro] = useState("");

  // Listas via React Query: reaproveitam o cache compartilhado e expoem
  // carregando/erro, em vez do api.get com catch silencioso de antes — que
  // deixava o select vazio sem explicar o motivo e travava o formulario.
  const { data: profissionais = [], isLoading: carregandoProf, isError: erroProf, refetch: refetchProf } = useProfissionais();
  const { data: empresas = [], isLoading: carregandoEmp, isError: erroEmp, refetch: refetchEmp } = useEmpresas();
  const criarOrdem = useCriarOrdem();
  const enviando = criarOrdem.isPending;

  function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    criarOrdem.mutate(
      {
        local,
        descricao,
        prioridade,
        solicitante,
        profissional: responsavel,
        chamado_id: chamado.id || null,
        empresa_id: empresaId || null,
      },
      {
        onSuccess: () => {
          showToast("Ordem de serviço criada com sucesso", "success");
          navigate("/ordens-servico");
        },
        // Mensagem especifica do interceptor (cold start, sessao expirada, etc.)
        // num unico canal (banner), em vez de um texto fixo generico duplicado.
        onError: (err) => setErro(err.message || "Erro ao cadastrar ordem de serviço"),
      }
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Ordens de Serviço", to: "/ordens-servico" },
          { label: "Nova" },
        ]} />
        <h1 style={{ fontSize: "var(--fs-24)", fontWeight: 700, color: "var(--text-1)" }}>Nova Ordem de Serviço</h1>
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
          <div role="alert" style={{
            background: "var(--alta-bg)",
            border: "1px solid color-mix(in srgb, var(--alta) 30%, transparent)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            fontSize: "var(--fs-13)",
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
            <label style={labelStyle}>Descrição</label>
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
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Empresa</label>
            <select value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} disabled={carregandoEmp}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">{carregandoEmp ? "Carregando empresas..." : "Selecione uma empresa"}</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.nome}</option>
              ))}
            </select>
            {erroEmp && <ErroCarregamento texto="Não foi possível carregar as empresas." onRetry={refetchEmp} />}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Responsável</label>
            <select value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required disabled={carregandoProf}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">{carregandoProf ? "Carregando profissionais..." : "Selecione um profissional"}</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.nome}>{p.nome}</option>
              ))}
            </select>
            {erroProf && <ErroCarregamento texto="Não foi possível carregar os profissionais." onRetry={refetchProf} />}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={enviando} aria-busy={enviando} style={{
              background: "var(--primary-strong)", color: "#fff",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-13)", fontWeight: 500, border: "none",
              cursor: enviando ? "not-allowed" : "pointer",
              transition: "var(--transition)",
              display: "flex", alignItems: "center", gap: 6,
              opacity: enviando ? 0.7 : 1,
            }}
              onMouseEnter={(e) => { if (!enviando) e.currentTarget.style.background = "var(--primary-dark)"; }}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--primary-strong)"}
            >
              {enviando ? <Loader2 size={15} aria-hidden="true" style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} aria-hidden="true" />}
              {enviando ? "Cadastrando..." : "Cadastrar OS"}
            </button>
            <button type="button" onClick={() => navigate(-1)} style={{
              background: "var(--surface-3)", color: "var(--text-1)",
              border: "1px solid var(--border)",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-13)", fontWeight: 500, cursor: "pointer",
              transition: "var(--transition)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <ArrowLeft size={15} aria-hidden="true" />
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Mensagem de falha de carregamento de uma lista, com acao de tentar novamente.
function ErroCarregamento({ texto, onRetry }) {
  return (
    <div role="alert" style={{
      marginTop: 6, fontSize: "var(--fs-12)", color: "var(--alta)",
      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
    }}>
      {texto}
      <button type="button" onClick={() => onRetry()} style={{
        background: "none", border: "none", color: "var(--primary)",
        cursor: "pointer", textDecoration: "underline", fontSize: "var(--fs-12)", padding: 0,
      }}>
        Tentar novamente
      </button>
    </div>
  );
}
