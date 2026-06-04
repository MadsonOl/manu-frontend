import { Component } from "react";

/*
 * Captura erros de renderizacao em qualquer ponto da arvore e exibe uma tela de
 * recuperacao amigavel, em vez de deixar a pagina em branco. E o ponto natural
 * de integracao com monitoramento de erros em producao (ex.: Sentry - ver P5).
 */
export default class ErrorBoundary extends Component {
  state = { erro: null };

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    // Ponto de envio para um servico de monitoramento de erros em producao.
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary capturou um erro:", erro, info);
    }
  }

  render() {
    if (!this.state.erro) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: 40,
            maxWidth: 440,
            width: "100%",
            textAlign: "center",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <h1 style={{ fontSize: "var(--fs-20)", fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
            Algo deu errado
          </h1>
          <p style={{ fontSize: "var(--fs-14)", color: "var(--text-2)", lineHeight: 1.6, marginBottom: 24 }}>
            Ocorreu um erro inesperado nesta tela. Tente recarregar a pagina. Se o
            problema continuar, entre em contato com o suporte.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              minHeight: 44,
              padding: "0 20px",
              background: "var(--primary-strong)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-13)",
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            Recarregar a pagina
          </button>
        </div>
      </div>
    );
  }
}
