import { Link } from "react-router-dom";
import {
  Wrench, Zap, ArrowRight, ChevronDown,
  ClipboardList, BarChart2, Building2, HardHat, Shield,
} from "lucide-react";

const features = [
  { icon: ClipboardList, title: "Chamados públicos", desc: "Qualquer pessoa abre um chamado via link ou QR code, sem precisar de login" },
  { icon: Wrench, title: "Ordens de Serviço", desc: "Transforme chamados em ordens, atribua responsáveis e acompanhe o status em tempo real" },
  { icon: BarChart2, title: "Relatórios", desc: "Filtre e imprima relatórios completos das ordens de serviço por período, local ou profissional" },
  { icon: Building2, title: "Múltiplas empresas", desc: "Gerencie dados de diferentes empresas com cabeçalhos personalizados nas ordens" },
  { icon: HardHat, title: "Equipe técnica", desc: "Cadastre profissionais com funções e documentação, vinculando-os às ordens de serviço" },
  { icon: Shield, title: "Acesso seguro", desc: "Autenticação Firebase com rotas protegidas e controle de acesso por perfil de gestor" },
];

export default function Sobre() {
  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      {/* Hero */}
      <section style={{
        minHeight: "calc(100vh - 56px)",
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
          Gestão de Manutenções
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
          Controle total das suas manutenções
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
          Plataforma completa para gestores e equipes técnicas gerenciarem chamados,
          ordens de serviço e profissionais.
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
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--primary)"}
            >
              Começar agora
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
          Tudo que você precisa
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
          manu — Gestão de Manutenções
        </span>
      </footer>
    </div>
  );
}
