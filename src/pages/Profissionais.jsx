import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useProfissionais, useSalvarProfissional, useExcluirProfissional } from "../hooks/useProfissionais";
import { useFuncoes, useCriarFuncao } from "../hooks/useFuncoes";
import { useSlowHint } from "../hooks/useSlowHint";
import Modal from "../components/Modal";
import Breadcrumb from "../components/ui/Breadcrumb";
import { SkeletonRows, GhostBtn, thStyle, tdStyle } from "../components/ui/TableUtils";
import Pagination from "../components/ui/Pagination";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorState from "../components/ui/ErrorState";
import ColdStartBanner from "../components/ui/ColdStartBanner";
import { inputStyle, labelStyle, handleFocus, handleBlur } from "../components/ui/InputStyles";
import Field from "../components/ui/Field";
import { maskTelefone, maskCPF, onlyDigits } from "../utils/masks";
import { validarCPF, validarTelefone, validarEmail } from "../utils/validators";
import { Plus, Trash2, Inbox, Pencil, X } from "lucide-react";

export default function Profissionais() {
  const { data, isLoading, isError, error, refetch } = useProfissionais();
  const profissionais = data ?? [];
  const slow = useSlowHint(isLoading);
  const salvarProfissional = useSalvarProfissional();
  const excluirProfissional = useExcluirProfissional();

  // Lista secundaria do formulario; falha de carga vira lista vazia (select vazio).
  const { data: funcoes = [] } = useFuncoes();
  const criarFuncao = useCriarFuncao();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [funcao, setFuncao] = useState("");
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState({});
  const [modalFuncao, setModalFuncao] = useState(false);
  const [novaFuncao, setNovaFuncao] = useState("");
  const [page, setPage] = useState(1);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const perPage = 10;
  const { showToast } = useToast();

  function iniciarEdicao(profissional) {
    setEditando(profissional.id);
    setNome(profissional.nome);
    // Aplica as mascaras aos valores vindos da API (que podem estar so com
    // digitos) para exibir de forma consistente.
    setTelefone(maskTelefone(profissional.telefone));
    setEmail(profissional.email);
    setRg(profissional.rg);
    setCpf(maskCPF(profissional.cpf));
    setFuncao(profissional.funcao || "");
    setErros({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditando(null);
    setNome(""); setTelefone(""); setEmail("");
    setRg(""); setCpf(""); setFuncao("");
    setErros({});
  }

  // Valida documentos/contato. Retorna true se nao houver erros.
  function validar() {
    const e = {};
    if (!validarTelefone(telefone)) e.telefone = "Telefone invalido. Use DDD + numero.";
    if (!validarEmail(email)) e.email = "E-mail invalido.";
    if (!validarCPF(cpf)) e.cpf = "CPF invalido.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!validar()) return;
    // Documentos e telefone seguem normalizados (so digitos) para a API.
    const payload = {
      nome,
      telefone: onlyDigits(telefone),
      email: email.trim(),
      rg,
      cpf: onlyDigits(cpf),
      funcao,
    };
    salvarProfissional.mutate(
      { id: editando, payload },
      {
        onSuccess: () => {
          showToast(editando ? "Profissional atualizado com sucesso" : "Profissional cadastrado com sucesso", "success");
          cancelarEdicao();
        },
        onError: (err) =>
          setErro(err.message || (editando ? "Erro ao atualizar profissional" : "Erro ao cadastrar profissional")),
      }
    );
  }

  function excluir(id) {
    excluirProfissional.mutate(id, {
      onSuccess: () => showToast("Profissional excluído com sucesso", "success"),
      onError: (e) => showToast(e.message, "error"),
    });
  }

  function salvarFuncao() {
    if (!novaFuncao.trim()) return;
    criarFuncao.mutate(novaFuncao, {
      onSuccess: () => {
        setNovaFuncao("");
        setModalFuncao(false);
        showToast("Função cadastrada com sucesso", "success");
      },
      onError: (e) => showToast(e.message, "error"),
    });
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
          <h1 style={{ fontSize: "var(--fs-24)", fontWeight: 700, color: "var(--text-1)" }}>Profissionais</h1>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        background: "var(--surface-1)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 24,
      }}>
        {erro && (
          <div style={{
            background: "var(--alta-bg)", border: "1px solid color-mix(in srgb, var(--alta) 30%, transparent)",
            borderRadius: "var(--radius-md)", padding: "10px 14px",
            fontSize: "var(--fs-13)", color: "var(--alta)", marginBottom: 16,
          }}>{erro}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field id="prof-nome" label="Nome" value={nome} onChange={setNome} required autoComplete="name" />
            <Field
              id="prof-telefone" label="Telefone" value={telefone}
              onChange={(v) => setTelefone(maskTelefone(v))}
              onBlur={() => setErros((p) => ({ ...p, telefone: telefone && !validarTelefone(telefone) ? "Telefone invalido. Use DDD + numero." : "" }))}
              required inputMode="tel" placeholder="(00) 00000-0000" error={erros.telefone}
            />
            <Field
              id="prof-email" label="E-mail" type="email" value={email}
              onChange={setEmail}
              onBlur={() => setErros((p) => ({ ...p, email: email && !validarEmail(email) ? "E-mail invalido." : "" }))}
              required inputMode="email" autoComplete="email" placeholder="nome@exemplo.com" error={erros.email}
            />
            <Field id="prof-rg" label="RG" value={rg} onChange={setRg} required />
            <Field
              id="prof-cpf" label="CPF" value={cpf}
              onChange={(v) => setCpf(maskCPF(v))}
              onBlur={() => setErros((p) => ({ ...p, cpf: cpf && !validarCPF(cpf) ? "CPF invalido." : "" }))}
              required inputMode="numeric" placeholder="000.000.000-00" error={erros.cpf}
            />
            <Field id="prof-funcao" label="Função" type="select" value={funcao} onChange={setFuncao} required>
              <option value="">Selecione uma função</option>
              {funcoes.map((f) => (
                <option key={f.id} value={f.nome}>{f.nome}</option>
              ))}
            </Field>
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
            <button type="button" onClick={() => setModalFuncao(true)} style={{
              background: "var(--surface-3)", color: "var(--text-1)",
              border: "1px solid var(--border)", padding: "8px 16px",
              borderRadius: "var(--radius-md)", fontSize: "var(--fs-13)", fontWeight: 500,
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
                {["ID", "Nome", "Telefone", "E-mail", "RG", "CPF", "Função", "Ações"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isError ? (
                <tr>
                  <td colSpan="8"><ErrorState message={error.message} onRetry={refetch} /></td>
                </tr>
              ) : isLoading ? <SkeletonRows cols={8} /> : paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: 48, textAlign: "center" }}>
                    <Inbox size={32} style={{ color: "var(--text-3)", marginBottom: 12 }} />
                    <div style={{ fontSize: "var(--fs-14)", fontWeight: 500, color: "var(--text-2)" }}>Nenhum profissional cadastrado</div>
                    <div style={{ fontSize: "var(--fs-13)", color: "var(--text-3)", marginTop: 4 }}>Use o formulário acima para cadastrar</div>
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
                  <td style={tdStyle} data-label="ID">{p.id}</td>
                  <td style={tdStyle} data-label="Nome">{p.nome}</td>
                  <td style={tdStyle} data-label="Telefone">{maskTelefone(p.telefone)}</td>
                  <td style={tdStyle} data-label="E-mail">{p.email}</td>
                  <td style={tdStyle} data-label="RG">{p.rg}</td>
                  <td style={tdStyle} data-label="CPF">{maskCPF(p.cpf)}</td>
                  <td style={tdStyle} data-label="Função">{p.funcao}</td>
                  <td style={{ padding: "13px 16px", display: "flex", gap: 4 }} data-label="Ações">
                    <GhostBtn icon={Pencil} title="Editar" hoverColor="var(--primary)" onClick={() => iniciarEdicao(p)} />
                    <GhostBtn icon={Trash2} title="Excluir" hoverColor="var(--alta)" onClick={() => setConfirmDelete(p.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !isError && profissionais.length > 0 && (
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
              borderRadius: "var(--radius-md)", fontSize: "var(--fs-13)", fontWeight: 500, cursor: "pointer",
            }}>Cancelar</button>
            <button onClick={salvarFuncao} style={{
              background: "var(--primary-strong)", color: "#fff",
              border: "none", padding: "8px 16px",
              borderRadius: "var(--radius-md)", fontSize: "var(--fs-13)", fontWeight: 500, cursor: "pointer",
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
