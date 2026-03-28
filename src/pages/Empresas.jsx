import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Breadcrumb from "../components/ui/Breadcrumb";
import { SkeletonRows, GhostBtn, thStyle, tdStyle } from "../components/ui/TableUtils";
import Pagination from "../components/ui/Pagination";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { inputStyle, labelStyle, handleFocus, handleBlur } from "../components/ui/InputStyles";
import { Plus, Trash2, Inbox, Loader2, Pencil, X } from "lucide-react";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [gestor, setGestor] = useState("");
  const [info, setInfo] = useState("");
  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepErro, setCepErro] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
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

  function mascaraCep(valor) {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  }

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
    setCnpj(empresa.cnpj);
    setNome(empresa.nome);
    setCep("");
    setEndereco(empresa.endereco);
    setGestor(empresa.gestor_manutencao);
    setInfo(empresa.informacoes_adicionais || "");
    setCepErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditando(null);
    setCnpj(""); setNome(""); setEndereco("");
    setGestor(""); setInfo(""); setCep(""); setCepErro("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      const payload = {
        cnpj,
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
      carregarEmpresas();
    } catch {
      setErro(editando ? "Erro ao atualizar empresa" : "Erro ao cadastrar empresa");
    }
  }

  async function excluir(id) {
    try {
      await api.delete(`/empresas/${id}`);
      setEmpresas(empresas.filter((e) => e.id !== id));
      showToast("Empresa excluída com sucesso", "success");
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
          <Breadcrumb items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Empresas" },
          ]} />
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
          <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
              <label style={labelStyle}>CEP</label>
              <div style={{ position: "relative" }}>
                <input
                  value={cep}
                  onChange={(e) => {
                    const formatado = mascaraCep(e.target.value);
                    setCep(formatado);
                  }}
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
                  style={inputStyle}
                />
                {cepLoading && (
                  <Loader2
                    size={16}
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
                <span style={{ fontSize: 12, color: "var(--alta)", marginTop: 4, display: "block" }}>
                  {cepErro}
                </span>
              )}
            </div>
            <div>
              <label style={labelStyle}>Endereço</label>
              <input value={endereco} onChange={(e) => setEndereco(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={labelStyle}>Gestor de Manutenção</label>
              <input value={gestor} onChange={(e) => setGestor(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Informações Adicionais</label>
            <textarea value={info} onChange={(e) => setInfo(e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
            <button type="submit" style={{
              background: "var(--primary)", color: "#fff",
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer",
              transition: "var(--transition)", display: "flex", alignItems: "center", gap: 6,
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--primary)"}
            >
              {editando ? <Pencil size={15} /> : <Plus size={15} />}
              {editando ? "Salvar alterações" : "Cadastrar"}
            </button>
            {editando && (
              <button type="button" onClick={cancelarEdicao} style={{
                background: "transparent", color: "var(--text-2)",
                border: "1px solid var(--border)", padding: "8px 16px",
                borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 500,
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

      {/* Table */}
      <div style={{
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["ID", "CNPJ", "Nome", "Endereço", "Gestor", "Ações"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRows cols={6} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-2)" }}>Nenhuma empresa cadastrada</div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Use o formulário acima para cadastrar</div>
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
                  <td style={tdStyle}>{e.id}</td>
                  <td style={tdStyle}>{e.cnpj}</td>
                  <td style={tdStyle}>{e.nome}</td>
                  <td style={tdStyle}>{e.endereco}</td>
                  <td style={tdStyle}>{e.gestor_manutencao}</td>
                  <td style={{ padding: "13px 16px", display: "flex", gap: 4 }}>
                    <GhostBtn icon={Pencil} title="Editar" hoverColor="var(--primary)" onClick={() => iniciarEdicao(e)} />
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => setConfirmDelete(e.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && empresas.length > 0 && (
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
