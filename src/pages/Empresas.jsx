import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [gestor, setGestor] = useState("");
  const [info, setInfo] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregarEmpresas();
  }, []);

  async function carregarEmpresas() {
    try {
      const res = await api.get("/empresas");
      setEmpresas(res.data);
    } catch {
      /* API offline */
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
    } catch {
      setErro("Erro ao cadastrar empresa");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir esta empresa?")) return;
    try {
      await api.delete(`/empresas/${id}`);
      setEmpresas(empresas.filter((e) => e.id !== id));
    } catch {
      alert("Erro ao excluir empresa");
    }
  }

  return (
    <div className="page page-white">
      <Header />
      <div className="container">
        <div className="top-bar">
          <h2 className="page-title" style={{ margin: 0 }}>Cadastro de Empresas</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Voltar</button>
        </div>

        <div className="card mb-20" style={{ maxWidth: "100%" }}>
          {erro && <p className="error-msg">{erro}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>CNPJ</label>
                <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Nome da Empresa</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Gestor de Manutenção</label>
                <input value={gestor} onChange={(e) => setGestor(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Informações Adicionais</label>
              <textarea value={info} onChange={(e) => setInfo(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Cadastrar</button>
          </form>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>CNPJ</th>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Gestor</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.cnpj}</td>
                  <td>{e.nome}</td>
                  <td>{e.endereco}</td>
                  <td>{e.gestor_manutencao}</td>
                  <td>
                    <button className="action-btn delete" onClick={() => excluir(e.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {empresas.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: 24 }}>Nenhuma empresa cadastrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
