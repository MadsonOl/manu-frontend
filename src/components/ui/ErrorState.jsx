import { AlertTriangle, RotateCw } from "lucide-react";

/*
 * Estado de erro com mensagem clara e acao de tentar novamente. Usado dentro do
 * corpo das tabelas (em um <td colSpan>) e em qualquer area de carregamento.
 * role="alert" faz o leitor de tela anunciar a falha assim que ela aparece.
 */
export default function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      style={{
        padding: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        textAlign: "center",
      }}
    >
      <AlertTriangle size={32} style={{ color: "var(--alta)" }} aria-hidden="true" />
      <div style={{ fontSize: "var(--fs-14)", fontWeight: 500, color: "var(--text-1)", maxWidth: 460, lineHeight: 1.5 }}>
        {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 44,
            padding: "0 18px",
            background: "var(--primary-strong)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--fs-13)",
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary-strong)")}
        >
          <RotateCw size={15} aria-hidden="true" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
