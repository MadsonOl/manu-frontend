import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();

  const botoes = [
    { label: "Chamados", rota: "/chamados" },
    { label: "Ordens de Serviço", rota: "/ordens-servico" },
    { label: "Relatórios", rota: "/relatorios" },
    { label: "Cadastro de Empresas", rota: "/empresas" },
    { label: "Cadastro de Profissionais", rota: "/profissionais" },
  ];

  return (
    <div className="page page-white">
      <Header />
      <div className="container">
        <h2 className="page-title">Painel do Gestor</h2>
        <div className="dashboard-grid">
          {botoes.map((b) => (
            <button
              key={b.rota}
              className="btn btn-primary btn-large"
              onClick={() => navigate(b.rota)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
