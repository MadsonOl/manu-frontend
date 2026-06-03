import Modal from "../Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar exclusão",
  message = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
  confirmLabel = "Excluir",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            onClick={onClose}
            style={{
              background: "var(--surface-3)",
              color: "var(--text-1)",
              border: "1px solid var(--border)",
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-13)",
              fontWeight: 500,
              cursor: "pointer",
              transition: "var(--transition)",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            style={{
              background: "var(--danger-strong)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-13)",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ textAlign: "center" }}>
        <AlertTriangle size={32} style={{ color: "var(--normal)", marginBottom: 16 }} />
        <p style={{ fontSize: "var(--fs-14)", color: "var(--text-2)", lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    </Modal>
  );
}
