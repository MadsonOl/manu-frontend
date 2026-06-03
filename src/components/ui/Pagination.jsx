import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function Pagination({ page, totalPages, total, showing, onPageChange }) {
  if (total === 0) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div style={{
      background: "var(--surface-2)",
      borderTop: "1px solid var(--border)",
      padding: "12px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    }}>
      <span style={{ fontSize: "var(--fs-12)", color: "var(--text-3)" }}>
        Mostrando {showing} de {total} registros
      </span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Pagina anterior"
          title="Pagina anterior"
          style={{
            background: "var(--surface-3)", color: "var(--text-1)",
            border: "1px solid var(--border)", padding: 0,
            borderRadius: "var(--radius-sm)", fontSize: "var(--fs-12)",
            cursor: page === 1 ? "not-allowed" : "pointer",
            opacity: page === 1 ? 0.5 : 1,
            minWidth: 44, minHeight: 44, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ fontSize: "var(--fs-12)", color: "var(--text-3)", padding: "0 4px" }}>...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Pagina ${p}`}
              aria-current={p === page ? "page" : undefined}
              style={{
                background: p === page ? "var(--primary-strong)" : "var(--surface-3)",
                color: p === page ? "#fff" : "var(--text-1)",
                border: p === page ? "1px solid var(--primary-strong)" : "1px solid var(--border)",
                padding: "0 10px",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--fs-12)",
                fontWeight: p === page ? 600 : 400,
                cursor: "pointer",
                minWidth: 44,
                minHeight: 44,
                transition: "var(--transition)",
              }}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Proxima pagina"
          title="Proxima pagina"
          style={{
            background: "var(--surface-3)", color: "var(--text-1)",
            border: "1px solid var(--border)", padding: 0,
            borderRadius: "var(--radius-sm)", fontSize: "var(--fs-12)",
            cursor: page === totalPages ? "not-allowed" : "pointer",
            opacity: page === totalPages ? 0.5 : 1,
            minWidth: 44, minHeight: 44, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
