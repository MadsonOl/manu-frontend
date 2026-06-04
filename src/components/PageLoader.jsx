import { Loader2 } from "lucide-react";

/*
 * Fallback exibido enquanto o chunk de uma rota (carregada sob demanda via
 * React.lazy) ainda nao chegou. Mantem a tela informando carregamento em vez de
 * ficar em branco durante o code splitting.
 */
export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Carregando"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <Loader2
        size={28}
        style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }}
        aria-hidden="true"
      />
    </div>
  );
}
