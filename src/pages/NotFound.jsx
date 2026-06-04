import { Link } from "react-router-dom";
import { Home } from "lucide-react";

/*
 * Pagina 404 para rotas inexistentes (rota catch-all). Antes, URLs desconhecidas
 * nao renderizavam nada (tela vazia).
 */
export default function NotFound() {
  return (
    <div style={{
      minHeight: "calc(100vh - 56px)",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center",
    }}>
      <span style={{ fontSize: "var(--fs-28)", fontWeight: 700, color: "var(--primary)" }}>404</span>
      <h1 style={{ fontSize: "var(--fs-20)", fontWeight: 600, color: "var(--text-1)", margin: "8px 0" }}>
        Pagina nao encontrada
      </h1>
      <p style={{ fontSize: "var(--fs-14)", color: "var(--text-2)", maxWidth: 420, lineHeight: 1.6, marginBottom: 24 }}>
        O endereco que voce acessou nao existe ou foi movido.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          minHeight: 44,
          padding: "0 20px",
          background: "var(--primary-strong)",
          color: "#fff",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--fs-13)",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        <Home size={16} aria-hidden="true" />
        Voltar ao inicio
      </Link>
    </div>
  );
}
