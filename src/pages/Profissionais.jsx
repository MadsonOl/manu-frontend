import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";
import Modal from "../components/Modal";
import Breadcrumb from "../components/ui/Breadcrumb";
import { SkeletonRows, GhostBtn, thStyle, tdStyle } from "../components/ui/TableUtils";
import Pagination from "../components/ui/Pagination";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { inputStyle, labelStyle, handleFocus, handleBlur } from "../components/ui/InputStyles";
import { Plus, Trash2, Inbox, Pencil, X } from "lucide-react";

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
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
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

  function iniciarEdicao(profissional) {
    setEditando(profissional.id);
    setNome(profissional.nome);
    setTelefone(profissional.telefone);
    setEmail(profissional.email);
    setRg(profissional.rg);
    setCpf(profissional.cpf);
    setFuncao(profissional.funcao || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditando(null);
    setNome(""); setTelefone(""); setEmail("");
    setRg(""); setCpf(""); setFuncao("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      const payload = { nome, telefone, email, rg, cpf, funcao };
      if (editando) {
        await api.put(`/profissionais/${editando}`, payload);
        showToast("Profissional atualizado com sucesso", "success");
      } else {
        await api.post("/profissionais", payload);
        showToast("Profissional cadastrado com sucesso", "success");
      }
      cancelarEdicao();
      carregarProfissionais();
    } catch {
      setErro(editando ? "Erro ao atualizar profissional" : "Erro ao cadastrar profissional");
    }
  }

  async function excluir(id) {
    try {
      await api.delete(`/profissionais/${id}`);
      setProfissionais(profissionais.filter((p) => p.id !== id));
      showToast("Profissional excluído com sucesso", "success");
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
      showToast("Função cadastrada com sucesso", "success");
    } catch {
      showToast("Erro ao cadastrar função", "error");
    }
  }

  const totalPages = Math.max(1, Math.ceil(profissionais.length / perPage));
  const paginated = profissionais.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Breadcrumb items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Profissionais" },
          ]} />
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
          <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
              <label style={labelStyle}>Função</label>
              <select value={funcao} onChange={(e) => setFuncao(e.target.value)} required
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
                <option value="">Selecione uma função</option>
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
            <button type="button" onClick={() => setModalFuncao(true)} style={{
              background: "var(--surface-3)", color: "var(--text-1)",
              border: "1px solid var(--border)", padding: "8px 16px",
              borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 500,
              cursor: "pointer", transition: "var(--transition)",
              display: "flex", alignItems: "center", gap: 6,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-1)"; }}
            >
              <Plus size={15} />
              Nova função
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
                {["ID", "Nome", "Telefone", "E-mail", "RG", "CPF", "Função", "Ações"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRows cols={8} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-2)" }}>Nenhum profissional cadastrado</div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Use o formulário acima para cadastrar</div>
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
                  <td style={tdStyle}>{p.id}</td>
                  <td style={tdStyle}>{p.nome}</td>
                  <td style={tdStyle}>{p.telefone}</td>
                  <td style={tdStyle}>{p.email}</td>
                  <td style={tdStyle}>{p.rg}</td>
                  <td style={tdStyle}>{p.cpf}</td>
                  <td style={tdStyle}>{p.funcao}</td>
                  <td style={{ padding: "13px 16px", display: "flex", gap: 4 }}>
                    <GhostBtn icon={Pencil} title="Editar" hoverColor="var(--primary)" onClick={() => iniciarEdicao(p)} />
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => setConfirmDelete(p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && profissionais.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={profissionais.length}
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
        message="Deseja excluir este profissional? Esta ação não pode ser desfeita."
      />

      {/* Modal Nova Função */}
      <Modal
        isOpen={modalFuncao}
        onClose={() => setModalFuncao(false)}
        title="Cadastrar Nova Função"
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
          <label style={labelStyle}>Nome da função</label>
          <input value={novaFuncao} onChange={(e) => setNovaFuncao(e.target.value)}
            style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
        </div>
      </Modal>

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
