# Relatório de Transformação Digital — Frontend manu

> Rascunho técnico para a Atividade Final (ODS 8 — Trabalho decente e
> crescimento econômico). Consolida o ciclo de evolução do frontend **manu**
> (React 19 + Vite), organizado nas três etapas exigidas, com evidências
> concretas e métricas antes × depois. Os trechos marcados com **[print]**
> indicam capturas de tela a anexar no PDF final.

Produto: aplicação web de gestão de manutenções (chamado público, dashboard do
gestor, ordens de serviço, relatórios, cadastros de empresas e profissionais).
Pilha: React 19, Vite 8, React Router 7, Firebase Auth, Axios, Vitest.

---

## Sumário executivo

| Indicador | Antes | Depois |
| --- | --- | --- |
| Contraste de texto secundário (`--text-3`) | 2,5–3,1:1 (reprova AA) | 4,6–5,7:1 (passa AA) |
| Contraste de texto em botões (branco) | 2,8–3,3:1 (reprova AA) | 5,3–5,8:1 (passa AA) |
| Modo de alto contraste | inexistente | ≥ 7:1 (WCAG 1.4.6) |
| Paletas para daltonismo | inexistente | 4 tipos, validadas por simulação |
| Bundle JS de carregamento inicial | ~495 KB (1 arquivo) | entry 214 KB + chunks sob demanda |
| Leituras no Firestore ao listar ordens | 1 + N (uma consulta de empresa por OS) | 1 + 1 leitura em lote (`get_all`) |
| Testes automatizados | 1 (frontend) | 55 (frontend, inclui a11y/axe) + 47 (backend, cobertura ~67%) |
| CI valida Pull Requests | não (só push na main) | sim, nos dois repositórios |
| Lint (ESLint) | 0 erros / 11 warnings | 0 erros / 0 warnings |
| Validação server-side (CPF/CNPJ/e-mail) | inexistente | validação com dígito verificador nos schemas |
| Responsividade (header mobile, cards) | sobreposição/aperto | sem sobreposição; padding fluido |
| Tela em branco em erro/rota inválida | sim | ErrorBoundary + página 404 |

---

## Etapa 1 — Diagnóstico

### 1.1 Auditoria de acessibilidade (WCAG 2.1 AA)

Ferramentas recomendadas para evidência: **axe DevTools** e **Lighthouse
(aba Accessibility)**. **[print]** auditoria inicial.

Principais achados (classificados por severidade na seção *Plano de ação*):

| # | Achado | Critério WCAG |
| --- | --- | --- |
| A1 | Texto secundário cinza (rótulos, subtítulos, cabeçalhos de tabela) com contraste ~3:1 | 1.4.3 |
| A2 | Texto branco sobre botões primário/perigo com 2,8–3,3:1 | 1.4.3 |
| A3 | Sem indicador de foco consistente para teclado | 2.4.7 |
| A4 | Botões só com ícone sem nome acessível; alvos < 44px | 4.1.2 / 2.5.5 |
| A5 | Tabelas largas com rolagem horizontal no mobile | 1.4.10 |
| A6 | Formulários sem associação rótulo↔campo nem indicação de obrigatório | 1.3.1 / 3.3.2 |
| A7 | Cor como único indicador de status/prioridade | 1.4.1 |
| A8 | Modal sem foco preso, sem Esc e sem `role="dialog"` | 2.1.2 / 4.1.2 |
| A9 | Sem `skip-link`, sem título de página por rota | 2.4.1 / 2.4.2 |

### 1.2 Qualidade de código e dívidas técnicas

Ferramenta de análise estática: **ESLint** (`npm run lint`). **[print]** saída.

Dívidas técnicas identificadas:

| # | Dívida técnica / code smell | Impacto |
| --- | --- | --- |
| C1 | Bundle único (~495 KB) — todas as páginas carregadas de uma vez | Performance |
| C2 | Ausência de *Error Boundary* — erro de render gera tela em branco | Robustez |
| C3 | Sem rota *catch-all* (404) — URLs inválidas renderizam vazio | Robustez/UX |
| C4 | Variáveis de ambiente lidas sem validação — falha silenciosa | Operação |
| C5 | Cobertura de testes mínima (1 teste) | Confiabilidade |
| C6 | Cores de status/borda *hardcoded* (não acompanham o tema) | Manutenibilidade |
| C7 | Lógica de carregamento/erro duplicada entre páginas | Manutenibilidade |
| C8 | Mensagens de erro genéricas ("erro inesperado") | UX |

### 1.3 Usabilidade e performance

- **Avaliação heurística (Nielsen):** falhas em *visibilidade do status do
  sistema* (cold start sem aviso), *prevenção de erros* (exclusões sem
  confirmação consistente) e *flexibilidade* (sem preferências de acessibilidade).
- **Performance:** carregamento inicial penalizado pelo bundle único; o backend
  (plano gratuito) tem *cold start* de até ~60 s, sem feedback ao usuário.

### 1.4 KPIs definidos (≥ 5)

| KPI | Definição | Por que importa |
| --- | --- | --- |
| 1. Taxa de conclusão do chamado público | chamados enviados ÷ formulários iniciados | mede a eficácia do principal fluxo de entrada |
| 2. Tempo médio para abrir um chamado | mediana do tempo de preenchimento + envio | usabilidade da tarefa central |
| 3. Taxa de erro de API / timeouts | respostas 4xx-5xx e timeouts ÷ total | saúde técnica e impacto do cold start |
| 4. Adoção do gestor | OS criadas/semana e logins ativos | valor entregue ao cliente |
| 5. Score de acessibilidade (axe/Lighthouse) | nº de violações e nota a11y | progresso da inclusão (ODS 8) |
| 6. Web Vitals (LCP/CLS/INP) p75 | percentil 75 em produção | experiência percebida |

Critérios de alerta sugeridos: KPI 3 > 5% por 15 min; KPI 6 LCP p75 > 2,5 s.

---

## Plano de ação priorizado (por severidade)

| Severidade | Itens | Ação |
| --- | --- | --- |
| **Crítico** | A2, C2, C3 | Contraste de botões; ErrorBoundary; rota 404 |
| **Alto** | A1, A3, A4, A8, C1, C5 | Contraste/foco; nomes acessíveis; modal; code splitting; testes |
| **Médio** | A5, A6, A7, C4, C7, C8 | Tabelas responsivas; formulários; paletas; env; hook de dados; erros claros |
| **Baixo** | A9, C6 | Skip-link/títulos; tokenizar cores |

---

## Etapa 2 — Implementações (antes × depois)

### 2.1 Acessibilidade (≥ 3 correções) — **[print] antes × depois por tela**

| Correção | Critério | Antes → Depois |
| --- | --- | --- |
| Contraste de texto secundário | 1.4.3 | `#606068` (2,5–3,1:1) → `#8A8A94` (4,6–5,7:1) |
| Contraste de botões (branco) | 1.4.3 | sobre `--primary` 3,34:1 / `--alta` 2,77:1 → `--primary-strong` 5,8:1 / `--danger-strong` 5,29:1 |
| Modo de alto contraste | 1.4.6 | inexistente → tema `[data-theme=hc]` com 9,7–17,2:1 |
| Escala de fonte 100–200% | 1.4.4 | inexistente → tokens `rem` escaláveis pelo `<html>` |
| Paletas para daltonismo | 1.4.1 | inexistente → 4 tipos (protan/deuteran/tritan/acromat.), **validadas por simulação Machado 2009** |
| Foco visível | 2.4.7 | inconsistente → `:focus-visible` global |
| Nomes acessíveis + alvo 44px | 4.1.2 / 2.5.5 | ícones mudos → `aria-label`/`title` + 44×44 |
| Tabelas com *reflow* | 1.4.10 | rolagem horizontal → cartões empilhados no mobile |
| Formulários | 1.3.1 / 3.3.2 | sem label/obrigatório → `Field` com `htmlFor/id`, `aria-required`, erro `role=alert` |
| Modal | 2.1.2 / 4.1.2 | div genérica → `role=dialog`, foco preso, Esc, foco devolvido |
| Skip-link + título por rota | 2.4.1 / 2.4.2 | inexistentes → implementados |
| Mensagens de status/erro | 4.1.3 | banners de submit mudos → `role="alert"`/`role="status"` (login, cadastro, OS, recuperar senha) |
| Menu lateral no mobile (drawer) | 2.1.2 / 4.1.2 | sem foco preso → focus trap, `role="dialog"` e foco devolvido ao gatilho |

Como reproduzir as métricas de contraste: os valores foram calculados pela
fórmula de luminância relativa do WCAG; as paletas de daltonismo foram
verificadas simulando cada deficiência (matrizes Machado et al., 2009) e
confirmando a separação perceptual entre os níveis de status/prioridade.

### 2.2 Refatorações de código (≥ 3) — **[print] trechos antes × depois**

1. **Camada de dados com React Query** — hooks de query/mutation por recurso
   (`useChamados`, `useOrdens`, etc.) substituíram a busca manual repetida nas 6
   telas (dívida C7): cache, deduplicação, revalidação, retry seletivo e
   invalidação automática após mutações. O cold-start virou o hook `useSlowHint`.
2. **`Field` + `utils/masks` + `utils/validators`** — campos de formulário
   acessíveis e validação de CPF/CNPJ (dígito verificador), telefone e e-mail,
   removendo inputs repetidos e validação ausente (A6, C7).
3. **`apiErrors.mensagemDeErro` + interceptor** — tradução central de erros em
   mensagens claras e específicas (C8), agora coberta por testes.
4. **Separação `main.jsx` / `App.jsx`** — ponto de entrada enxuto e árvore da
   aplicação isolada (organização e fast-refresh); lint final **0 erros / 0
   warnings** e remoção de código morto.
5. **Validação server-side no backend (defesa em profundidade)** — novo módulo
   `app/schemas/_validators.py` (FastAPI/Pydantic) com validação de CPF/CNPJ por
   dígito verificador, telefone, e-mail e campos obrigatórios, aplicada aos
   schemas de entrada (`Create`) sem afetar a leitura de dados legados. Cobre o
   risco de confiar apenas no cliente; coberto por 13 testes de schema.
6. **`CrudRepository` (backend)** — extração de um repositório CRUD genérico
   (criar/listar/obter/atualizar/excluir) sobre o Firestore, eliminando a
   duplicação do mesmo padrão em cinco *routers* (chamados, ordens, empresas,
   profissionais e funções). Rotas, status e formato de resposta preservados.
7. **Consistência do contrato do PUT de ordens (backend)** — o
   `PUT /ordens-servico/{id}` passou a resolver e devolver o objeto `empresa`
   como o GET e o POST, em vez de `empresa: null`.
8. **Robustez do relatório (backend)** — datas inválidas vindas do cliente
   passaram a retornar 422 (antes 500); registros legados com data ausente são
   ignorados sem derrubar o relatório; e o relatório passou a resolver a empresa
   em lote (antes retornava sempre `null`).

### 2.3 Otimizações de performance (≥ 2) — **[print] bundle antes × depois**

1. **Code splitting por rota** (`React.lazy` + `Suspense`): bundle único de
   **~495 KB / ~145 KB gzip** → cada página 1–10 KB carregada sob demanda.
2. **Firebase carregado sob demanda** (dynamic import): o SDK (~113 KB) saiu do
   caminho crítico de renderização. Caminho crítico inicial caiu para
   **~74 KB gzip** (entry), com Firebase, Axios e ícones em chunks próprios.
3. **Cache de dados com React Query**: deduplicação e revalidação evitam
   refetch redundante; telas que compartilham dados (Ordens/Relatórios/Dashboard)
   reutilizam o cache e navegam instantaneamente.
4. **Timeout + feedback de cold start**: `timeout` de 75 s + `ColdStartBanner` e
   retry, evitando requisições penduradas e dando visibilidade do status.
5. **Eliminação de N+1 na listagem de ordens (backend)**: a listagem fazia uma
   leitura de empresa por ordem; passou a carregar todas as empresas
   referenciadas em uma única leitura em lote (`db.get_all`), resolvendo o
   vínculo em memória. Em uma página com N ordens, as leituras caem de 1 + N
   para 1 + 1.

### 2.4 Melhorias de usabilidade (≥ 2)

1. Aviso de cold start + estado de erro com "Tentar novamente" (visibilidade e
   recuperação de erros).
2. Confirmação em ações destrutivas/irreversíveis (excluir e finalizar OS) e
   máscaras em tempo real nos documentos.
3. Botão de salvar desabilitado durante o envio (com indicador) nos formulários,
   evitando cadastros duplicados quando o backend está frio.
4. Estado vazio distingue "nenhum dado" de "filtro/busca sem resultado" (com ação
   "Limpar filtros"); o diálogo de confirmação diferencia exclusão de finalização
   pela cor/ícone; o cadastro de conta passou a dar feedback de sucesso.

### 2.5 Pipeline de CI/CD, deploy e monitoramento

- **CI/CD (frontend):** GitHub Actions roda `lint` + `test:coverage` + `build`
  em **push na `main` e em Pull Requests** (PRs deixam de ser mesclados sem
  validação). O deploy é feito pela integração Git da Vercel.
- **CI/CD (backend):** GitHub Actions roda `pytest` com cobertura em push e PR;
  o **deploy no Render só dispara em push na `main`** (`if: github.event_name ==
  'push'`), nunca em PR. `pip` cacheado e execução única dos testes.
- **Testes:** 55 no frontend (inclui acessibilidade automatizada com `jest-axe` e
  os fluxos críticos: chamado público, login, geração de OS e guarda de rota) e
  47 no backend (endpoints com DB mockado + validação de schemas; inclui testes
  que comprovam a leitura em lote na listagem de ordens, a `empresa` resolvida no
  PUT e o relatório retornando 422 para data inválida), com relatório de cobertura
  (`npm run test:coverage` / `pytest --cov`).

- **Deploy:** Vercel — *preview* automático por PR e produção no merge da
  `main`. `vercel.json` faz o *rewrite* de SPA.
- **Plano de rollback:** "Instant Rollback" do Vercel para o deploy anterior.
- **Checklist de pré-lançamento:** lint/build/test verdes; auditoria a11y;
  variáveis de ambiente definidas; rollback testado; 404 e ErrorBoundary
  validados.
- **Monitoramento pós-lançamento (implementado):** integração com **Sentry**
  (erros de frontend, ativada por `VITE_SENTRY_DSN`) já ligada ao `ErrorBoundary`,
  e coleta de **Web Vitals** (LCP/INP/CLS/FCP/TTFB). Sem DSN é um no-op e nem é
  baixado. Critérios de alerta nos KPIs 3 e 6. **[print]** painel após configurar.

---

## Etapa 3 — Lições aprendidas e iterações futuras

**Decisões acertadas:** padronizar cores em *tokens* CSS permitiu temas
(alto contraste e daltonismo) com baixíssimo esforço; a camada de dados com
React Query (hooks de query/mutation por recurso) centralizou o tratamento de
carregamento/erro; testar funções puras
(máscaras/validadores) deu alto retorno com pouco custo.

**Decisões a revisar:** o uso intenso de *estilos inline* dificultou aplicar
temas e foi contornado com variáveis CSS — um sistema de design tokens desde o
início teria evitado retrabalho; a escala de fonte exigiu converter `px` → `rem`
em massa.

**Desafios:** *cold start* do backend gratuito (mitigado com timeout + aviso);
garantir contraste AA sem descaracterizar a identidade visual escura.

**Próximas iterações:** extrair um componente `Button` único (centralizar
contraste/foco/estados); adotar `useSyncExternalStore`/design tokens
formalizados; ampliar testes para fluxos de página; instrumentar os KPIs com
eventos reais; reduzir ainda mais o JavaScript inicial analisando a composição
dos *chunks* (ex.: `rollup-plugin-visualizer`).

---

## Anexos — checklist de evidências (capturas)

- [ ] Auditoria axe/Lighthouse **antes** e **depois** (a11y).
- [ ] Saída do ESLint (análise estática) antes × depois.
- [ ] Telas em cada modo: padrão, alto contraste e uma paleta de daltonismo
      (Chamados/Ordens com badges + menu com prévia ao vivo).
- [ ] Tabela em desktop vs. cartões no mobile (reflow).
- [ ] Formulário com máscara/erro inline/campo obrigatório.
- [ ] `ColdStartBanner`, `ErrorState` (retry) e diálogo de confirmação.
- [ ] Tamanho do bundle antes × depois (`npm run build`).
- [ ] Execução dos testes: 55 no frontend (`npm run test`) e 47 no backend (`pytest`).
- [ ] Pipeline de CI verde e painel de monitoramento.
