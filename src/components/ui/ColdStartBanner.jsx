import { Loader2 } from "lucide-react";

/*
 * Aviso exibido durante um carregamento que esta demorando: o backend pode
 * estar "acordando" apos inatividade (cold start de ate ~1 minuto). Mantem o
 * usuario informado em vez de deixar so o esqueleto girando. role="status"
 * para anuncio nao intrusivo por leitores de tela.
 */
export default function ColdStartBanner() {
  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--primary-muted)",
        border: "1px solid var(--primary)",
        borderRadius: "var(--radius-md)",
        padding: "10px 14px",
        marginBottom: 16,
        fontSize: "var(--fs-13)",
        color: "var(--text-1)",
      }}
    >
      <Loader2 size={16} style={{ color: "var(--primary)", flexShrink: 0, animation: "spin 1s linear infinite" }} aria-hidden="true" />
      O servidor pode estar reativando apos um periodo ocioso. Isso pode levar ate cerca de um minuto na primeira vez.
    </div>
  );
}
