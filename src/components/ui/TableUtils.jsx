export const thStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-3)",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  padding: "12px 16px",
  textAlign: "left",
};

export const tdStyle = {
  fontSize: 13,
  color: "var(--text-1)",
  padding: "13px 16px",
};

export function SkeletonRows({ cols }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      {Array.from({ length: cols }).map((_, j) => (
        <td key={j} style={{ padding: "13px 16px" }}>
          <div style={{
            background: "var(--surface-3)",
            borderRadius: "var(--radius-sm)",
            height: 14,
            width: "80%",
            animation: "skeletonPulse 1.4s ease infinite",
            animationDelay: `${0.1 * i}s`,
          }} />
        </td>
      ))}
    </tr>
  ));
}

// eslint-disable-next-line no-unused-vars -- Icon is used as JSX component
export function GhostBtn({ icon: Icon, title, hoverColor, onClick }) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{
        background: "transparent",
        color: "var(--text-2)",
        border: "none",
        padding: 6,
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        transition: "var(--transition)",
        display: "inline-flex",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface-3)";
        e.currentTarget.style.color = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-2)";
      }}
    >
      <Icon size={15} />
    </button>
  );
}
