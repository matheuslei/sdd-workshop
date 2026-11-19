# Tasks: Simulador do Workshop SDD

**Input**: plan.md, spec.md, research.md, data-model.md, contracts/roteiro-etapa.md
**Tests**: sem testes automatizados; cada tarefa traz "Conferir" manual (quickstart.md).

## Phase 1: Setup

- [X] T001 Criar pastas `assets/`, `guia/`, `simulador/` e `LEIA-ME.md` na raiz. Conferir: estrutura do plan.md.

## Phase 2: Foundational (bloqueia todas as histórias)

- [X] T002 `assets/sim.css`: tokens claro/escuro (adaptados de curso.css), layout, cabeçalho, cartões, terminal (cmd/ps/agente), árvore, visualizador, alertas, 375px. Conferir: página vazia sem rolagem lateral.
- [X] T003 `assets/sim.js`: estado `sdd-sim-v1` com fallback em memória, `iniciarPagina` (cabeçalho, nav, tema, trilha), `copiar`, `ehChaveReal`, `etapasDaTrilha`, `esc`. (FR-001, FR-006, FR-013) Conferir: console sem erros.
- [X] T004 `Sim.terminalGuiado` em `assets/sim.js`: textarea, validação exato/prefixo/bloco/livre, dicas, terminal errado, saída animada com selo, histórico ↑↓, Mostrar resposta, Pular, lista de etapas, problemas comuns (desvio), modo Assistir. (FR-003, FR-004, FR-005, FR-007, FR-015, FR-016)

## Phase 3: US1 — Instalar o ambiente (P1) 🎯 MVP

- [X] T005 [US1] `assets/roteiros.js` → `ROTEIROS.instalacao` (comum + opencode + claude) e `ROTEIROS.problemas`, com textos literais do guia de instalação do workshop (`_local/material-workshop/guia-instalacao.md`). (FR-002, II)
- [X] T006 [US1] `index.html`: escolha de trilha, mapa das 4 áreas com progresso, reiniciar. (FR-001)
- [X] T007 [US1] `simulador/instalacao.html`: instancia o motor; ao concluir mostra "Ambiente pronto" e link para o projeto. Conferir: quickstart passo 2.

## Phase 4: US2 — Construir o projeto (P1)

- [X] T008 [US2] `ROTEIROS.projeto` em `assets/roteiros.js`: Passo 0, constitution, specify, clarify (2 perguntas + atalhos), plan, tasks, analyze (opcional), implement, `uv run python main.py`, bônus. Prompts literais de `_local/material-workshop/prompts-pratica.md`. (FR-008, FR-010, FR-017)
- [X] T009 [P] [US2] `assets/projeto-arquivos.js`: conteúdo de todos os artefatos e do código gerado. (FR-009)
- [X] T010 [US2] `Sim.arvore` + visualizador em `assets/sim.js`; `simulador/projeto.html` com agente, árvore e botão "Abrir no navegador". (FR-009, FR-011) Conferir: quickstart passo 3.

## Phase 5: US3 — Monitor de hábitos (P1)

- [X] T011 [US3] `assets/habitos-app.js`: criar, marcar/desmarcar, sequência, %30d, semanas, futuro bloqueado, renomear, arquivar/restaurar, excluir com confirmação, metas (bônus). (FR-012, FR-013)
- [X] T012 [US3] `simulador/app-final.html`: moldura de navegador 127.0.0.1:8000 + aviso de simulação. Conferir: quickstart passo 4.

## Phase 6: US4 — Guia e prompts (P2)

- [X] T013 [P] [US4] `guia/instalacao.html` gerado de `ROTEIROS.instalacao` para a trilha escolhida (com abas para trocar). (FR-014)
- [X] T014 [P] [US4] `guia/prompts.html` gerado de `ROTEIROS.projeto` + tabela de respostas combinadas e de problemas. (FR-014)

## Phase 7: US5/US6 (P2/P3)

- [X] T015 [US5] Painel "Problemas comuns" nos dois simuladores. Conferir: quickstart passo 6.
- [X] T016 [US6] Botão Assistir e Reiniciar progresso. Conferir: quickstart passo 7.

## Phase 8: Polish

- [X] T017 `README.md` (apresentação, como abrir, aviso de simulação, revisão humana).
- [X] T018 Validação do quickstart completo no navegador (console, 375px, tema).

## Dependencies

T001 → T002–T004 → (US1: T005–T007) → (US2: T008–T010; T009 paralelo) → US3 (T011–T012)
→ US4 (T013, T014 paralelos) → T015–T016 → T017–T018.
