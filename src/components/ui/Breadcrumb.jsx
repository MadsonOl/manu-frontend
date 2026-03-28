import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }) {
  return (
    <div style={{
      fontSize: 12,
      color: "var(--text-3)",
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 4,
    }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {i > 0 && <ChevronRight size={12} />}
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
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
