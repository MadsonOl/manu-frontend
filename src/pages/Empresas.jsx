import { useCallback, useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { useApiData } from "../hooks/useApiData";
import Breadcrumb from "../components/ui/Breadcrumb";
import { SkeletonRows, GhostBtn, thStyle, tdStyle } from "../components/ui/TableUtils";
import Pagination from "../components/ui/Pagination";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorState from "../components/ui/ErrorState";
import ColdStartBanner from "../components/ui/ColdStartBanner";
import { inputStyle, labelStyle, handleFocus, handleBlur } from "../components/ui/InputStyles";
import Field from "../components/ui/Field";
import { maskCNPJ, maskCEP, onlyDigits } from "../utils/masks";
import { validarCNPJ } from "../utils/validators";
import { Plus, Trash2, Inbox, Loader2, Pencil, X } from "lucide-react";

export default function Empresas() {
  const carregar = useCallback(() => api.get("/empresas").then((r) => r.data), []);
  const { data, setData: setEmpresas, loading, error, slow, reload } = useApiData(carregar);
  const empresas = data || [];

  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [gestor, setGestor] = useState("");
  const [info, setInfo] = useState("");
  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepErro, setCepErro] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState({});
  const [page, setPage] = useState(1);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const perPage = 10;
  const { showToast } = useToast();

  async function buscarCep(valor) {
    const cepLimpo = valor.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    setCepLoading(true);
    setCepErro("");
    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await res.json();
      if (data.erro) {
        setCepErro("CEP não encontrado");
        return;
      }
      const enderecoFormatado =
        `${data.logradouro}, ${data.bairro}, ` +
        `${data.localidade} - ${data.uf}`;
      setEndereco(enderecoFormatado);
      setCepErro("");
    } catch {
      setCepErro("Erro ao buscar CEP");
    } finally {
      setCepLoading(false);
    }
  }

  function iniciarEdicao(empresa) {
    setEditando(empresa.id);
    setCnpj(maskCNPJ(empresa.cnpj));
    setNome(empresa.nome);
    setCep("");
    setEndereco(empresa.endereco);
    setGestor(empresa.gestor_manutencao);
    setInfo(empresa.informacoes_adicionais || "");
    setCepErro("");
    setErros({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditando(null);
    setCnpj(""); setNome(""); setEndereco("");
    setGestor(""); setInfo(""); setCep(""); setCepErro("");
    setErros({});
  }

  // Valida o CNPJ (digito verificador). Retorna true se nao houver erros.
  function validar() {
    const e = {};
    if (!validarCNPJ(cnpj)) e.cnpj = "CNPJ invalido.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!validar()) return;
    try {
      const payload = {
        // CNPJ normalizado (so digitos) para a API.
        cnpj: onlyDigits(cnpj),
        nome,
        endereco,
        gestor_manutencao: gestor,
        informacoes_adicionais: info,
      };
      if (editando) {
        await api.put(`/empresas/${editando}`, payload);
        showToast("Empresa atualizada com sucesso", "success");
      } else {
        await api.post("/empresas", payload);
        showToast("Empresa cadastrada com sucesso", "success");
      }
      cancelarEdicao();
      reload();
    } catch (err) {
      setErro(err.message || (editando ? "Erro ao atualizar empresa" : "Erro ao cadastrar empresa"));
    }
  }

  async function excluir(id) {
    try {
      await api.delete(`/empresas/${id}`);
      setEmpresas((prev) => prev.filter((e) => e.id !== id));
      showToast("Empresa excluída com sucesso", "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(empresas.length / perPage));
  const paginated = empresas.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Breadcrumb items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Empresas" },
          ]} />
          <h1 style={{ fontSize: "var(--fs-24)", fontWeight: 700, color: "var(--text-1)" }}>Empresas</h1>
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
            fontSize: "var(--fs-13)", color: "var(--alta)", marginBottom: 16,
          }}>{erro}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field
              id="empresa-cnpj" label="CNPJ" value={cnpj}
              onChange={(v) => setCnpj(maskCNPJ(v))}
              onBlur={() => setErros((p) => ({ ...p, cnpj: cnpj && !validarCNPJ(cnpj) ? "CNPJ invalido." : "" }))}
              required inputMode="numeric" placeholder="00.000.000/0000-00" error={erros.cnpj}
            />
            <Field id="empresa-nome" label="Nome da Empresa" value={nome} onChange={setNome} required />

            {/* CEP autopreenche o endereco; mantem o indicador de carregamento. */}
            <div>
              <label htmlFor="empresa-cep" style={labelStyle}>CEP</label>
              <div style={{ position: "relative" }}>
                <input
                  id="empresa-cep"
                  value={cep}
                  onChange={(e) => setCep(maskCEP(e.target.value))}
                  onBlur={(e) => {
                    handleBlur(e);
                    buscarCep(cep);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      buscarCep(cep);
                    }
                  }}
                  onFocus={handleFocus}
                  placeholder="00000-000"
                  inputMode="numeric"
                  aria-describedby={cepErro ? "empresa-cep-erro" : undefined}
                  style={inputStyle}
                />
                {cepLoading && (
                  <Loader2
                    size={16}
                    aria-label="Buscando CEP"
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--primary)",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
              </div>
              {cepErro && (
                <span id="empresa-cep-erro" role="alert" style={{ fontSize: "var(--fs-12)", color: "var(--alta)", marginTop: 6, display: "block" }}>
                  {cepErro}
                </span>
              )}
            </div>

            <Field id="empresa-endereco" label="Endereço" value={endereco} onChange={setEndereco} required autoComplete="street-address" />
            <Field id="empresa-gestor" label="Gestor de Manutenção" value={gestor} onChange={setGestor} required />
          </div>
          <div style={{ marginTop: 16 }}>
            <Field id="empresa-info" label="Informações Adicionais" type="textarea" value={info} onChange={setInfo} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
            <button type="submit" style={{
              background: "var(--primary-strong)", color: "#fff",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-13)", fontWeight: 500, border: "none", cursor: "pointer",
              transition: "var(--transition)", display: "flex", alignItems: "center", gap: 6,
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--primary-strong)"}
            >
              {editando ? <Pencil size={15} /> : <Plus size={15} />}
              {editando ? "Salvar alterações" : "Cadastrar"}
            </button>
            {editando && (
              <button type="button" onClick={cancelarEdicao} style={{
                background: "transparent", color: "var(--text-2)",
                border: "1px solid var(--border)", padding: "8px 16px",
                borderRadius: "var(--radius-md)", fontSize: "var(--fs-13)", fontWeight: 500,
                cursor: "pointer", transition: "var(--transition)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <X size={15} />
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Aviso de cold start durante carregamento demorado */}
      {loading && slow && <ColdStartBanner />}

      {/* Table */}
      <div style={{
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table className="reflow-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["ID", "CNPJ", "Nome", "Endereço", "Gestor", "Ações"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="6"><ErrorState message={error} onRetry={reload} /></td>
                </tr>
              ) : loading ? <SkeletonRows cols={6} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    <div style={{ fontSize: "var(--fs-14)", fontWeight: 500, color: "var(--text-2)" }}>Nenhuma empresa cadastrada</div>
                    <div style={{ fontSize: "var(--fs-13)", color: "var(--text-3)", marginTop: 4 }}>Use o formulário acima para cadastrar</div>
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
                  <td style={tdStyle} data-label="ID">{e.id}</td>
                  <td style={tdStyle} data-label="CNPJ">{maskCNPJ(e.cnpj)}</td>
                  <td style={tdStyle} data-label="Nome">{e.nome}</td>
                  <td style={tdStyle} data-label="Endereço">{e.endereco}</td>
                  <td style={tdStyle} data-label="Gestor">{e.gestor_manutencao}</td>
                  <td style={{ padding: "13px 16px", display: "flex", gap: 4 }} data-label="Ações">
                    <GhostBtn icon={Pencil} title="Editar" hoverColor="var(--primary)" onClick={() => iniciarEdicao(e)} />
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => setConfirmDelete(e.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !error && empresas.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={empresas.length}
            showing={paginated.length}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => excluir(confirmDelete)}
        message="Deseja excluir esta empresa? Esta ação não pode ser desfeita."
      />

      <style>{`
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
