import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
  // A regiao permanece sempre montada (mesmo vazia) para que o aria-live
  // anuncie de forma confiavel inclusive o primeiro toast.
  return (
    <div
      // Regiao viva: leitores de tela anunciam toasts ao surgirem.
      role="status"
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: "var(--finalizado)",
  error: "var(--alta)",
  warning: "var(--normal)",
  info: "var(--primary)",
};

function Toast({ toast, onClose }) {
  const Icon = iconMap[toast.type] || Info;
  const color = colorMap[toast.type] || "var(--primary)";

  return (
    <div style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderLeft: `3px solid ${color}`,
      borderRadius: "var(--radius-md)",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      boxShadow: "var(--shadow-lg)",
      fontSize: "var(--fs-13)",
      color: "var(--text-1)",
      animation: "slideInRight 0.2s ease",
      minWidth: 280,
      maxWidth: 400,
      position: "relative",
      overflow: "hidden",
    }}>
      <Icon size={16} style={{ color, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onClose}
        aria-label="Fechar notificacao"
        title="Fechar"
        style={{
          background: "none",
          border: "none",
          color: "var(--text-3)",
          cursor: "pointer",
          minWidth: 44,
          minHeight: 44,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 2,
        background: color,
        animation: "progressShrink 4s linear forwards",
      }} />
    </div>
  );
}
