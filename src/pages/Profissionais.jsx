import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

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
  const navigate = useNavigate();

  useEffect(() => {
    carregarProfissionais();
    carregarFuncoes();
  }, []);

  async function carregarProfissionais() {
    try {
      const res = await api.get("/profissionais");
      setProfissionais(res.data);
    } catch {
      /* API offline */
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
    } catch {
      setErro("Erro ao cadastrar profissional");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este profissional?")) return;
    try {
      await api.delete(`/profissionais/${id}`);
      setProfissionais(profissionais.filter((p) => p.id !== id));
    } catch {
      alert("Erro ao excluir profissional");
    }
  }

  async function salvarFuncao() {
    if (!novaFuncao.trim()) return;
    try {
      await api.post("/funcoes", { nome: novaFuncao });
      setNovaFuncao("");
      setModalFuncao(false);
      carregarFuncoes();
    } catch {
      alert("Erro ao cadastrar função");
    }
  }

  return (
    <div className="page page-white">
      <Header />
      <div className="container">
        <div className="top-bar">
          <h2 className="page-title" style={{ margin: 0 }}>Cadastro de Profissionais</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Voltar</button>
        </div>

        <div className="card mb-20" style={{ maxWidth: "100%" }}>
          {erro && <p className="error-msg">{erro}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>Nome</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>RG</label>
                <input value={rg} onChange={(e) => setRg(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>CPF</label>
                <input value={cpf} onChange={(e) => setCpf(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Função</label>
                <select value={funcao} onChange={(e) => setFuncao(e.target.value)} required>
                  <option value="">Selecione uma função</option>
                  {funcoes.map((f) => (
                    <option key={f.id} value={f.nome}>{f.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-row mt-12">
              <button type="submit" className="btn btn-primary">Cadastrar</button>
              <button type="button" className="link" onClick={() => setModalFuncao(true)}>
                Cadastrar nova função
              </button>
            </div>
          </form>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>RG</th>
                <th>CPF</th>
                <th>Função</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {profissionais.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.telefone}</td>
                  <td>{p.email}</td>
                  <td>{p.rg}</td>
                  <td>{p.cpf}</td>
                  <td>{p.funcao}</td>
                  <td>
                    <button className="action-btn delete" onClick={() => excluir(p.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {profissionais.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: 24 }}>Nenhum profissional cadastrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalFuncao && (
        <div className="modal-overlay" onClick={() => setModalFuncao(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Cadastrar Nova Função</h2>
            <div className="form-group">
              <label>Nome da função</label>
              <input value={novaFuncao} onChange={(e) => setNovaFuncao(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={salvarFuncao}>Salvar</button>
              <button className="btn btn-secondary" onClick={() => setModalFuncao(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
