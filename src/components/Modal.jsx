import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

/*
 * Dialogo modal acessivel:
 *   - role="dialog" + aria-modal + aria-labelledby (titulo) para leitores de tela;
 *   - foco movido para dentro ao abrir e devolvido ao gatilho ao fechar;
 *   - Tab/Shift+Tab presos dentro do dialogo (focus trap);
 *   - Esc fecha;
 *   - rolagem do fundo travada enquanto aberto.
 */
export default function Modal({ isOpen, onClose, title, children, footer }) {
  const dialogRef = useRef(null);
  const tituloId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const focoAnterior = document.activeElement;
    document.body.style.overflow = "hidden";

    const focaveis = () =>
      dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      ) ?? [];

    // Move o foco para o primeiro elemento focavel (ou o proprio dialogo).
    const primeiros = focaveis();
    (primeiros[0] || dialogRef.current)?.focus();

    function onKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focaveis();
      if (f.length === 0) {
        e.preventDefault();
        return;
      }
      const primeiro = f[0];
      const ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      focoAnterior?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          width: "90%",
          maxWidth: 560,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          animation: "modalIn 0.18s ease",
          outline: "none",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
        }}>
          <h3 id={tituloId} style={{ fontSize: "var(--fs-16)", fontWeight: 600, color: "var(--text-1)" }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            title="Fechar"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-2)",
              cursor: "pointer",
              minWidth: 44,
              minHeight: 44,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--text-1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-2)"; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
