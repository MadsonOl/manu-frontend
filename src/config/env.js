/*
 * Acesso centralizado e validado as variaveis de ambiente. Em vez de espalhar
 * `import.meta.env` pelo codigo e falhar silenciosamente quando algo nao esta
 * configurado, lemos tudo aqui e avisamos de forma clara (no boot) quais
 * variaveis essenciais faltam - util ao configurar o ambiente local e o deploy.
 */

export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  // Opcional: monitoramento de erros (Sentry). Sem DSN, o monitoramento e um
  // no-op e o SDK nem chega a ser baixado.
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
};

// Variaveis sem as quais o app nao funciona (API + autenticacao Firebase).
const OBRIGATORIAS = {
  VITE_API_URL: env.apiUrl,
  VITE_FIREBASE_API_KEY: env.firebase.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: env.firebase.authDomain,
  VITE_FIREBASE_PROJECT_ID: env.firebase.projectId,
  VITE_FIREBASE_APP_ID: env.firebase.appId,
};

/** Retorna a lista de variaveis obrigatorias ausentes. */
export function variaveisAusentes() {
  return Object.entries(OBRIGATORIAS)
    .filter(([, valor]) => !valor)
    .map(([nome]) => nome);
}

// Aviso de boot: nao derruba o app (o ErrorBoundary cuida de falhas de render),
// mas deixa claro no console o que precisa ser configurado.
const ausentes = variaveisAusentes();
if (ausentes.length > 0) {
  console.error(
    `[manu] Variaveis de ambiente ausentes: ${ausentes.join(", ")}. ` +
    `Defina-as no arquivo .env (local) e no painel do provedor de deploy.`
  );
}
