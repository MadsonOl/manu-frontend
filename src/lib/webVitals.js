/*
 * Coleta as Core Web Vitals (LCP, INP, CLS) e metricas de carregamento (FCP,
 * TTFB). Em desenvolvimento, registra no console para visibilidade local; em
 * producao, o monitoramento de performance e capturado pelo tracing do Sentry
 * (ver monitoring.js). Carregado de forma preguicosa para nao pesar o bundle.
 */
export function reportWebVitals() {
  import("web-vitals")
    .then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      const registrar = (metric) => {
        if (import.meta.env.DEV) {
          console.log(`[web-vitals] ${metric.name}: ${Math.round(metric.value)}`);
        }
      };
      onCLS(registrar);
      onINP(registrar);
      onLCP(registrar);
      onFCP(registrar);
      onTTFB(registrar);
    })
    .catch(() => {});
}
