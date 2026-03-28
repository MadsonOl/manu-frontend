import { AlertCircle, Minus, ArrowDown, Clock, CheckCircle } from "lucide-react";

export function PriorityBadge({ value }) {
  const config = {
    ALTA: { bg: "var(--alta-bg)", color: "var(--alta)", icon: AlertCircle },
    NORMAL: { bg: "var(--normal-bg)", color: "var(--normal)", icon: Minus },
    BAIXA: { bg: "var(--baixa-bg)", color: "var(--baixa)", icon: ArrowDown },
  };
  const c = config[value] || config.NORMAL;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      <c.icon size={11} />
      {value}
    </span>
  );
}

export function StatusBadge({ value }) {
  const isFinalizado = value === "FINALIZADO";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: isFinalizado ? "var(--finalizado-bg)" : "var(--atendimento-bg)",
      color: isFinalizado ? "var(--finalizado)" : "var(--atendimento)",
    }}>
      {isFinalizado
        ? <CheckCircle size={11} />
        : <Clock size={11} style={{ animation: "pulse 2s ease infinite" }} />
      }
      {value}
    </span>
  );
}
