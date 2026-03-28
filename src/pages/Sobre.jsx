import { Link } from "react-router-dom";

export default function Sobre() {
  return (
    <div className="page page-blue" style={{ justifyContent: "center", gap: 24 }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff", margin: 0 }}>manu</h1>
      <div className="card" style={{ textAlign: "left" }}>
        <h2 style={{ color: "#4A90D9", marginBottom: 16 }}>Conheça o manu</h2>
        <p style={{ marginBottom: 12, color: "#555", lineHeight: 1.6 }}>
          O <strong>manu</strong> é uma plataforma completa de gestão de manutenções.
          Com ele, gestores podem receber chamados, gerar ordens de serviço,
          acompanhar profissionais e emitir relatórios de forma simples e organizada.
        </p>
        <p style={{ marginBottom: 12, color: "#555", lineHeight: 1.6 }}>
          Qualquer pessoa pode abrir um chamado de manutenção através de um link
          ou QR code, sem necessidade de cadastro.
        </p>
        <p style={{ color: "#555", lineHeight: 1.6 }}>
          Gestores têm acesso a um painel completo com controle de chamados,
          ordens de serviço, empresas e profissionais cadastrados.
        </p>
        <div className="mt-20 text-center">
          <Link to="/"><button className="btn btn-primary">Voltar ao início</button></Link>
        </div>
      </div>
    </div>
  );
}
