import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [filtroProfissional, setFiltroProfissional] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregarOrdens();
  }, []);

  async function carregarOrdens() {
    try {
      const res = await api.get("/ordens-servico");
      setOrdens(res.data);
    } catch {
      /* API offline */
    }
  }

  async function finalizar(id) {
    try {
      await api.patch(`/ordens-servico/${id}/finalizar`);
      carregarOrdens();
    } catch {
      alert("Erro ao finalizar OS");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir esta ordem de serviço?")) return;
    try {
      await api.delete(`/ordens-servico/${id}`);
      setOrdens(ordens.filter((o) => o.id !== id));
    } catch {
      alert("Erro ao excluir OS");
    }
  }

  const ordensFiltradas = ordens.filter((o) => {
    if (filtroProfissional && o.profissional !== filtroProfissional) return false;
    if (filtroStatus && o.status !== filtroStatus) return false;
    if (filtroData && o.data !== filtroData) return false;
    return true;
  });

  const profissionaisUnicos = [...new Set(ordens.map((o) => o.profissional).filter(Boolean))];
  const statusUnicos = [...new Set(ordens.map((o) => o.status).filter(Boolean))];

  return (
    <div className="page page-white">
      <Header />
      <div className="container">
        <div className="top-bar">
          <h2 className="page-title" style={{ margin: 0 }}>Ordens de Serviço</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Voltar</button>
        </div>

        <div className="filter-bar">
          <span style={{ fontWeight: 500 }}>Filtrar:</span>
          <select value={filtroProfissional} onChange={(e) => setFiltroProfissional(e.target.value)}>
            <option value="">Todos profissionais</option>
            {profissionaisUnicos.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="">Todos status</option>
            {statusUnicos.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
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
                <th>Profissional</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {ordensFiltradas.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.data}</td>
                  <td>{o.local}</td>
                  <td>{o.descricao}</td>
                  <td>{o.prioridade}</td>
                  <td>{o.solicitante}</td>
                  <td>{o.profissional}</td>
                  <td>{o.status}</td>
                  <td>
                    <button className="action-btn view" onClick={() => setSelecionada(o)}>Ver</button>
                    <button className="action-btn finish" onClick={() => finalizar(o.id)}>Finalizar</button>
                    <button className="action-btn delete" onClick={() => excluir(o.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {ordensFiltradas.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: "center", padding: 24 }}>Nenhuma OS encontrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selecionada && (
        <div className="modal-overlay" onClick={() => setSelecionada(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>OS #{selecionada.id}</h2>
            <p><strong>Data:</strong> {selecionada.data}</p>
            <p><strong>Local:</strong> {selecionada.local}</p>
            <p><strong>Descrição:</strong> {selecionada.descricao}</p>
            <p><strong>Prioridade:</strong> {selecionada.prioridade}</p>
            <p><strong>Solicitante:</strong> {selecionada.solicitante}</p>
            <p><strong>Profissional:</strong> {selecionada.profissional}</p>
            <p><strong>Status:</strong> {selecionada.status}</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelecionada(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
