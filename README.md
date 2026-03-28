# manu — Frontend do Sistema de Gestão de Manutenções

Interface web desenvolvida em React para gestores e usuários externos do sistema **manu**. Permite a abertura de chamados públicos, gestão de ordens de serviço, cadastro de empresas e profissionais, e emissão de relatórios.

---

## Tecnologias Utilizadas

- **React 18** — biblioteca principal para construção da interface
- **Vite** — bundler e servidor de desenvolvimento
- **React Router DOM** — gerenciamento de rotas SPA
- **Firebase Authentication** — autenticação de gestores
- **Axios** — cliente HTTP para comunicação com a API

---

## Como Rodar Localmente

### Pré-requisitos

- [Node.js 20](https://nodejs.org/) ou superior
- Backend [manu-backend](https://github.com/seu-usuario/manu-backend) rodando em `http://127.0.0.1:8000`

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/manu-frontend.git
cd manu-frontend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env na raiz do projeto (veja a seção abaixo)
cp .env.example .env

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> **Observação:** o backend manu-backend precisa estar rodando em `http://127.0.0.1:8000` para que as chamadas à API funcionem corretamente.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

| Variável | Descrição | Onde encontrar |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Chave de API do projeto Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação do Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto no Firebase | Console do Firebase → Configurações do projeto → Configuração do SDK |
| `VITE_API_URL` | URL base da API do backend | Endereço onde o manu-backend está rodando (ex: `http://127.0.0.1:8000`) |

Exemplo:

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_API_URL=http://127.0.0.1:8000
```

---

## Estrutura de Pastas

```text
src/
├── pages/              # Páginas da aplicação (uma por rota)
├── components/         # Componentes reutilizáveis (Header, PrivateRoute)
├── services/
│   └── api.js          # Cliente HTTP com Axios e interceptor de token Firebase
├── contexts/
│   └── AuthContext.jsx  # Contexto de autenticação (usuário, login, logout)
└── firebase.js         # Inicialização e configuração do Firebase
```

---

## Páginas Disponíveis

### Rotas Públicas

| Rota | Página | Descrição |
| --- | --- | --- |
| `/` | Home | Página inicial com botões Entre, Cadastre-se e Conheça o manu |
| `/login` | Login | Formulário de login para gestores |
| `/cadastro` | Cadastro | Formulário de cadastro de novos gestores |
| `/recuperar-senha` | Recuperar Senha | Envio de e-mail de recuperação de senha |
| `/abrir-chamado` | Abrir Chamado | Formulário público para abertura de chamados (acessível via link ou QR code) |
| `/sobre` | Sobre | Página informativa sobre o sistema manu |

### Rotas Privadas (requerem autenticação)

| Rota | Página | Descrição |
| --- | --- | --- |
| `/dashboard` | Dashboard | Painel principal do gestor com acesso a todos os módulos |
| `/chamados` | Chamados | Lista de chamados com opções de visualizar, gerar OS e excluir |
| `/ordens-servico` | Ordens de Serviço | Lista de OS com filtros por profissional, data e status |
| `/ordens-servico/nova` | Nova OS | Formulário de criação de OS a partir de um chamado |
| `/relatorios` | Relatórios | Visualização de OS com opção de impressão |
| `/empresas` | Empresas | Cadastro e listagem de empresas |
| `/profissionais` | Profissionais | Cadastro e listagem de profissionais e funções |

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
