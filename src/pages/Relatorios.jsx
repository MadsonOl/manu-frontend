import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function Relatorios() {
  const [ordens, setOrdens] = useState([]);
  const [filtroProfissional, setFiltroProfissional] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/ordens-servico")
      .then((res) => setOrdens(res.data))
      .catch(() => {});
  }, []);

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
          <h2 className="page-title" style={{ margin: 0 }}>Relatórios</h2>
          <div className="flex-row">
            <button className="btn btn-primary" onClick={() => window.print()}>Imprimir</button>
            <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Voltar</button>
          </div>
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
                </tr>
              ))}
              {ordensFiltradas.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: 24 }}>Nenhuma OS encontrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
