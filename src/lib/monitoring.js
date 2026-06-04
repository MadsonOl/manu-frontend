import { env } from "../config/env";

/*
 * Monitoramento de erros em producao via Sentry. So inicializa se houver um DSN
 * configurado (VITE_SENTRY_DSN) — caso contrario e um no-op e o SDK do Sentry
 * nem e baixado (import dinamico). Captura tambem performance/Web Vitals pela
 * integracao de tracing.
 */
let sentryPromise = null;

export function initMonitoring() {
  if (!env.sentryDsn) return;
  sentryPromise = import("@sentry/react")
    .then((Sentry) => {
      Sentry.init({
        dsn: env.sentryDsn,
        environment: import.meta.env.MODE,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.1,
      });
      return Sentry;
    })
    .catch(() => null);
}

/** Envia uma excecao ao Sentry, se configurado. No-op caso contrario. */
export function captureException(erro, extra) {
  sentryPromise?.then((Sentry) => Sentry?.captureException(erro, { extra }));
}
