import { Link } from "react-router-dom";
import {
  Wrench, Zap, ArrowRight, ChevronDown,
  ClipboardList, BarChart2, Building2, HardHat, Shield,
} from "lucide-react";

const features = [
  { icon: ClipboardList, title: "Chamados publicos", desc: "Qualquer pessoa abre um chamado via link ou QR code, sem precisar de login" },
  { icon: Wrench, title: "Ordens de Servico", desc: "Transforme chamados em ordens, atribua responsaveis e acompanhe o status em tempo real" },
  { icon: BarChart2, title: "Relatorios", desc: "Filtre e imprima relatorios completos das ordens de servico por periodo, local ou profissional" },
  { icon: Building2, title: "Multiplas empresas", desc: "Gerencie dados de diferentes empresas com cabecalhos personalizados nas ordens" },
  { icon: HardHat, title: "Equipe tecnica", desc: "Cadastre profissionais com funcoes e documentacao, vinculando-os as ordens de servico" },
  { icon: Shield, title: "Acesso seguro", desc: "Autenticacao Firebase com rotas protegidas e controle de acesso por perfil de gestor" },
];

export default function Sobre() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 24,
      }}>
        {/* Chip */}
        <div style={{
          padding: "4px 12px",
          border: "1px solid var(--border)",
          borderRadius: 20,
          fontSize: 12,
          color: "var(--text-3)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 24,
          animation: "fadeIn 0.3s ease",
        }}>
          <Zap size={12} style={{ color: "var(--primary)" }} />
          Gestao de Manutencoes
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 700,
          color: "var(--text-1)",
          textAlign: "center",
          maxWidth: 700,
          lineHeight: 1.15,
          marginBottom: 16,
          animation: "fadeIn 0.4s ease 0.1s backwards",
        }}>
          Controle total das suas manutencoes
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 18,
          color: "var(--text-2)",
          textAlign: "center",
          maxWidth: 500,
          lineHeight: 1.6,
          marginBottom: 40,
          animation: "fadeIn 0.4s ease 0.2s backwards",
        }}>
          Plataforma completa para gestores e equipes tecnicas gerenciarem chamados,
          ordens de servico e profissionais.
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: 12,
          animation: "fadeIn 0.4s ease 0.3s backwards",
        }}>
          <Link to="/cadastro" style={{ textDecoration: "none" }}>
            <button style={{
              background: "var(--primary)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              transition: "var(--transition)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              Comecar agora
              <ArrowRight size={15} />
            </button>
          </Link>
          <a href="#features" style={{ textDecoration: "none" }}>
            <button style={{
              background: "var(--surface-3)",
              color: "var(--text-1)",
              border: "1px solid var(--border)",
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "var(--transition)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              Saiba mais
              <ChevronDown size={15} />
            </button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: "80px 24px",
        maxWidth: 1000,
        margin: "0 auto",
      }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-1)",
          textAlign: "center",
          marginBottom: 48,
        }}>
          Tudo que voce precisa
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 24,
              animation: `fadeIn 0.3s ease ${0.05 * i}s backwards`,
            }}>
              <div style={{
                width: 40,
                height: 40,
                background: "var(--primary-muted)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}>
                <f.icon size={20} style={{ color: "var(--primary)" }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: 24,
        textAlign: "center",
      }}>
        <span style={{ fontSize: 13, color: "var(--text-3)" }}>
          manu — Gestao de Manutencoes
        </span>
      </footer>
    </div>
  );
}
