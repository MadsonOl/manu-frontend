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
      <span style={{ fontSize: 12, color: "var(--text-3)" }}>
        Mostrando {showing} de {total} registros
      </span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          style={{
            background: "var(--surface-3)", color: "var(--text-1)",
            border: "1px solid var(--border)", padding: "4px 8px",
            borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
            opacity: page === 1 ? 0.5 : 1, display: "flex", alignItems: "center",
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ fontSize: 12, color: "var(--text-3)", padding: "0 4px" }}>...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                background: p === page ? "var(--primary)" : "var(--surface-3)",
                color: p === page ? "#fff" : "var(--text-1)",
                border: p === page ? "1px solid var(--primary)" : "1px solid var(--border)",
                padding: "4px 10px",
                borderRadius: "var(--radius-sm)",
                fontSize: 12,
                fontWeight: p === page ? 600 : 400,
                cursor: "pointer",
                minWidth: 32,
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
          style={{
            background: "var(--surface-3)", color: "var(--text-1)",
            border: "1px solid var(--border)", padding: "4px 8px",
            borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
            opacity: page === totalPages ? 0.5 : 1, display: "flex", alignItems: "center",
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
