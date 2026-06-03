import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/*
 * Trilha de navegacao (breadcrumb) acessivel: landmark <nav> rotulado, lista
 * ordenada <ol>/<li> e aria-current="page" no item atual (ultimo, sem `to`).
 * WCAG 1.3.1 (semantica) e padrao ARIA de breadcrumb.
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Trilha de navegacao" style={{ marginBottom: 8 }}>
      <ol style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: "var(--fs-12)",
        color: "var(--text-3)",
      }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
            {item.to ? (
              <Link
                to={item.to}
                style={{
                  color: "var(--text-3)",
                  textDecoration: "none",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-2)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-3)"}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
