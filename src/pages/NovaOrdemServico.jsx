import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function NovaOrdemServico() {
  const location = useLocation();
  const navigate = useNavigate();
  const chamado = location.state?.chamado || {};

  const [local, setLocal] = useState(chamado.local || "");
  const [descricao, setDescricao] = useState(chamado.descricao || "");
  const [prioridade, setPrioridade] = useState(chamado.prioridade || "NORMAL");
  const [solicitante, setSolicitante] = useState(chamado.solicitante || "");
  const [responsavel, setResponsavel] = useState("");
  const [profissionais, setProfissionais] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.get("/profissionais")
      .then((res) => setProfissionais(res.data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      await api.post("/ordens-servico", {
        local,
        descricao,
        prioridade,
        solicitante,
        profissional: responsavel,
        chamado_id: chamado.id || null,
      });
      navigate("/ordens-servico");
    } catch {
      setErro("Erro ao cadastrar ordem de serviço");
    }
  }

  return (
    <div className="page page-white">
      <Header />
      <div className="container" style={{ display: "flex", justifyContent: "center" }}>
        <div className="card" style={{ maxWidth: 560 }}>
          <h2 className="page-title">Nova Ordem de Serviço</h2>
          {erro && <p className="error-msg">{erro}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Local</label>
              <input value={local} onChange={(e) => setLocal(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Prioridade</label>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                <option value="BAIXA">BAIXA</option>
                <option value="NORMAL">NORMAL</option>
                <option value="ALTA">ALTA</option>
              </select>
            </div>
            <div className="form-group">
              <label>Solicitante</label>
              <input value={solicitante} onChange={(e) => setSolicitante(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Responsável</label>
              <select value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required>
                <option value="">Selecione um profissional</option>
                {profissionais.map((p) => (
                  <option key={p.id} value={p.nome}>{p.nome}</option>
                ))}
              </select>
            </div>
            <div className="flex-row mt-20">
              <button type="submit" className="btn btn-primary">Cadastrar OS</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Voltar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
