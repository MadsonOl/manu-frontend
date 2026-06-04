import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./config/env"; // valida variaveis de ambiente no boot
import { initMonitoring } from "./lib/monitoring";
import { reportWebVitals } from "./lib/webVitals";
import App from "./App";
import "./index.css";

// Observabilidade: monitoramento de erros (no-op sem DSN) e Web Vitals.
initMonitoring();
reportWebVitals();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
