import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function Chamados() {
  const [chamados, setChamados] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarChamados();
  }, []);

  async function carregarChamados() {
    try {
      const res = await api.get("/chamados");
      setChamados(res.data);
    } catch {
      /* API offline */
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este chamado?")) return;
    try {
      await api.delete(`/chamados/${id}`);
      setChamados(chamados.filter((c) => c.id !== id));
    } catch {
      alert("Erro ao excluir chamado");
    }
  }

  function gerarOS(chamado) {
    navigate("/ordens-servico/nova", { state: { chamado } });
  }

  return (
    <div className="page page-white">
      <Header />
      <div className="container">
        <div className="top-bar">
          <h2 className="page-title" style={{ margin: 0 }}>Chamados</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Voltar</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Local</th>
                <th>Descrição</th>
                <th>Prioridade</th>
                <th>Solicitante</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.data}</td>
                  <td>{c.local}</td>
                  <td>{c.descricao}</td>
                  <td>{c.prioridade}</td>
                  <td>{c.solicitante}</td>
                  <td>
                    <button className="action-btn view" onClick={() => setSelecionado(c)}>Ver</button>
                    <button className="action-btn generate" onClick={() => gerarOS(c)}>Gerar OS</button>
                    <button className="action-btn delete" onClick={() => excluir(c.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {chamados.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: "center", padding: 24 }}>Nenhum chamado encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selecionado && (
        <div className="modal-overlay" onClick={() => setSelecionado(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Chamado #{selecionado.id}</h2>
            <p><strong>Data:</strong> {selecionado.data}</p>
            <p><strong>Local:</strong> {selecionado.local}</p>
            <p><strong>Descrição:</strong> {selecionado.descricao}</p>
            <p><strong>Prioridade:</strong> {selecionado.prioridade}</p>
            <p><strong>Solicitante:</strong> {selecionado.solicitante}</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelecionado(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
