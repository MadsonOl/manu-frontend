import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    allowedHosts: ['host.docker.internal'],
  },
  build: {
    sourcemap: mode !== 'production',
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary"],
      // Foco da cobertura: regras de negocio e componentes (exclui bootstrap,
      // estilos e arquivos de configuracao sem logica testavel).
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/main.jsx",
        "src/firebase.js",
        "src/**/*.test.{js,jsx}",
        "src/test/**",
        "src/index.css",
      ],
    },
  },
}))
