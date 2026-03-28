import { useState } from "react";
import axios from "axios";

export default function AbrirChamado() {
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("NORMAL");
  const [solicitante, setSolicitante] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso(false);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/chamados`, {
        local,
        descricao,
        prioridade,
        solicitante,
      });
      setSucesso(true);
      setLocal(""); setDescricao(""); setPrioridade("NORMAL"); setSolicitante("");
    } catch {
      setErro("Erro ao abrir chamado. Tente novamente.");
    }
  }

  return (
    <div className="page page-blue" style={{ justifyContent: "center" }}>
      <div className="card text-center">
        <h1 style={{ fontSize: 36, color: "#4A90D9", marginBottom: 8 }}>manu</h1>
        <p style={{ color: "#888", marginBottom: 24 }}>Abrir Chamado</p>

        {sucesso && (
          <p className="success-msg">Chamado aberto com sucesso!</p>
        )}
        {erro && <p className="error-msg">{erro}</p>}

        {!sucesso ? (
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
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Cadastrar</button>
          </form>
        ) : (
          <button className="btn btn-primary" onClick={() => setSucesso(false)}>Abrir novo chamado</button>
        )}
      </div>
    </div>
  );
}
