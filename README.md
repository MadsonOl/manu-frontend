# manu — Frontend do Sistema de Gestão de Manutenções

Interface web desenvolvida em React para gestores e usuários externos do sistema **manu**. Permite a abertura de chamados públicos, gestão de ordens de serviço, cadastro de empresas e profissionais, e emissão de relatórios.

---

## Tecnologias Utilizadas

- **React 19** — biblioteca principal para construção da interface
- **Vite 8** — bundler e servidor de desenvolvimento
- **React Router DOM 7** — gerenciamento de rotas SPA (com code splitting)
- **TanStack Query (React Query)** — cache, deduplicação e revalidação dos dados
- **Firebase 12** — autenticação de gestores (carregado sob demanda)
- **Axios** — cliente HTTP para comunicação com a API
- **Lucide React** — biblioteca de ícones
- **Sentry + web-vitals** — monitoramento de erros e Core Web Vitals (opcional, por env)
- **Vitest + React Testing Library** — testes unitários e de componentes
- **ESLint** — linting e qualidade de código

---

## Como Rodar Localmente

### Pré-requisitos

- [Node.js 20](https://nodejs.org/) ou superior
- Backend [manu-backend](https://github.com/MadsonOl/manu-backend-) rodando localmente ou acessível via URL

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/MadsonOl/manu-backend-.git
cd manu-frontend-

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env na raiz do projeto (veja a seção abaixo)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> **Observação:** a variável `VITE_API_URL` deve apontar para o endereço do backend (localmente: `http://127.0.0.1:8000`, ou em produção: a URL do deploy no Render).

---

## Scripts Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento (porta 5173) |
| `npm run build` | Gera o build de produção na pasta `dist/` |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint em todos os arquivos |
| `npm run test` | Executa os testes uma vez |
| `npm run test:watch` | Executa os testes em modo watch |

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

| Variável | Descrição | Onde encontrar |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Chave de API do projeto Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação do Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto no Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de armazenamento do Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID do remetente de mensagens do Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_FIREBASE_APP_ID` | ID do app no Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_FIREBASE_MEASUREMENT_ID` | ID de medição do Google Analytics | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_API_URL` | URL base da API do backend | Endereço onde o manu-backend está rodando |
| `VITE_SENTRY_DSN` | (Opcional) DSN do Sentry para monitoramento de erros | Painel do Sentry → Project Settings → Client Keys (DSN) |

Exemplo:

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_API_URL=http://127.0.0.1:8000
```

---

## Estrutura de Pastas

```text
src/
├── pages/                  # Páginas da aplicação (carregadas sob demanda)
│   ├── Home.jsx … Profissionais.jsx
│   └── NotFound.jsx         # Página 404 (rota catch-all)
├── components/             # Componentes reutilizáveis
│   ├── Header.jsx           # Cabeçalho (com o menu de acessibilidade)
│   ├── Sidebar.jsx          # Menu lateral / drawer no mobile
│   ├── Layout.jsx           # Layout privado (Sidebar + conteúdo + skip-link)
│   ├── Modal.jsx            # Modal acessível (foco preso, Esc, role=dialog)
│   ├── AccessibilityMenu.jsx# Controles de contraste, escala e daltonismo
│   ├── ErrorBoundary.jsx    # Fronteira de erro (evita tela em branco)
│   ├── PageLoader.jsx       # Fallback do code splitting
│   ├── RouteTitle.jsx       # Título da aba por rota
│   ├── PrivateRoute.jsx     # Proteção de rotas autenticadas
│   └── ui/                  # Badge, Breadcrumb, ConfirmDialog, Field,
│                            # ErrorState, ColdStartBanner, Pagination, etc.
├── contexts/                # Auth, Toast e Accessibility (provider + hook)
├── hooks/                   # Queries/mutations (React Query) por recurso,
│                            # useSlowHint, useMediaQuery
├── lib/                     # queryClient (React Query), monitoring, webVitals
├── utils/                   # masks.js, validators.js (CPF/CNPJ com DV)
├── services/                # api.js (Axios + interceptor) e apiErrors.js
├── config/                  # env.js (validação de variáveis de ambiente)
├── test/                    # Vitest (masks, validators, apiErrors, Field, ...)
├── App.jsx                  # Árvore da aplicação (providers + rotas)
├── main.jsx                 # Bootstrap (createRoot + observabilidade)
├── firebase.js              # Inicialização preguiçosa (lazy) do Firebase
└── index.css                # Estilos globais, tokens e temas
```

---

## Páginas Disponíveis

### Rotas Públicas

| Rota | Página | Descrição |
| --- | --- | --- |
| `/` | Home | Página inicial com formulário público de abertura de chamados |
| `/login` | Login | Formulário de login para gestores |
| `/cadastro` | Cadastro | Formulário de cadastro de novos gestores |
| `/recuperar-senha` | Recuperar Senha | Envio de e-mail de recuperação de senha |
| `/abrir-chamado` | Abrir Chamado | Formulário público para abertura de chamados (acessível via link ou QR code) |
| `/sobre` | Sobre | Página informativa sobre o sistema manu |

### Rotas Privadas (requerem autenticação)

| Rota | Página | Descrição |
| --- | --- | --- |
| `/dashboard` | Dashboard | Painel principal do gestor com estatísticas e acesso a todos os módulos |
| `/chamados` | Chamados | Lista de chamados com busca, filtros por prioridade/data, visualização e geração de OS |
| `/ordens-servico` | Ordens de Serviço | Lista de OS com filtros por profissional, data e status |
| `/ordens-servico/nova` | Nova OS | Formulário de criação de OS a partir de um chamado |
| `/relatorios` | Relatórios | Visualização de OS com opção de impressão |
| `/empresas` | Empresas | Cadastro, edição e listagem de empresas (com busca de CEP via ViaCEP) |
| `/profissionais` | Profissionais | Cadastro, edição e listagem de profissionais e funções |

---

## Autenticação

O sistema utiliza **Firebase Authentication** com e-mail e senha.

- **Registro e login** — via `createUserWithEmailAndPassword` e `signInWithEmailAndPassword`
- **Recuperação de senha** — via `sendPasswordResetEmail`
- **Proteção de rotas** — o componente `PrivateRoute` verifica o estado de autenticação e redireciona para `/login` se o usuário não estiver logado
- **Token nas requisições** — o interceptor do Axios injeta automaticamente o token Firebase (`Bearer`) em todas as chamadas à API

---

## Acessibilidade e Qualidade

O frontend segue **WCAG 2.1 AA** e inclui um menu de preferências (no cabeçalho,
disponível em todas as telas):

- **Alto contraste** (≥ 7:1), **escala de fonte** (100/125/150/200%) e
  **paletas para daltonismo** (protanopia, deuteranopia, tritanopia,
  acromatopsia), persistidos em `localStorage`.
- Indicador de **foco visível**, **skip-link**, **títulos por rota**, suporte a
  **`prefers-reduced-motion`**, nomes acessíveis e alvos de toque ≥ 44px.
- **Tabelas responsivas** (viram cartões no mobile) e **formulários** com label
  associada, indicação de obrigatório e validação de CPF/CNPJ (dígito
  verificador), telefone e e-mail.

Robustez e operação:

- **ErrorBoundary** global e **página 404** evitam telas em branco.
- **Validação de variáveis de ambiente** no boot (`src/config/env.js`).
- **Tratamento de erros** centralizado com mensagens claras (cold start,
  offline, sessão expirada, etc.) e **timeout** de 75 s.
- **Code splitting por rota** reduz o JavaScript de carregamento inicial.
- **Cache de dados com React Query** (deduplicação, revalidação e retry seletivo)
  reduz chamadas e torna a navegação instantânea entre telas que compartilham dados.
- **Firebase carregado sob demanda** — sai do caminho crítico de renderização,
  acelerando o primeiro paint (sobretudo nas páginas públicas).
- **Observabilidade opcional**: Sentry (erros) + Web Vitals, ativados por env e
  sem custo no bundle quando não configurados.
- **Testes** com Vitest (`npm run test`). Detalhes do ciclo de evolução em
  [`docs/RELATORIO-TRANSFORMACAO-DIGITAL.md`](docs/RELATORIO-TRANSFORMACAO-DIGITAL.md).

---

## Deploy

- **Plataforma:** [Vercel](https://vercel.com/)
- **CI/CD:** GitHub Actions valida o build a cada push na branch `main` (`.github/workflows/deploy.yml`)
- **Deploy automático:** o Vercel detecta o push na branch `main` e realiza o deploy automaticamente
- **Configuração:** o arquivo `vercel.json` na raiz contém a regra de rewrite necessária para que o React Router funcione corretamente em produção:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
