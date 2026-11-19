# Implementation Plan: Simulador do Workshop SDD

**Branch**: `001-simulador-workshop` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-simulador-workshop/spec.md`

## Summary

Minicurso estático (HTML/CSS/JS clássico, abre em `file://`) com quatro áreas: guia, simulador
de instalação, simulador do projeto e app final. Um único motor de terminal guiado
(`Sim.terminalGuiado`) executa **roteiros de dados** (`assets/roteiros.js`): cada etapa
declara terminal, comando esperado, saída e dicas. O simulador do projeto usa o mesmo motor
em modo "agente" e alimenta uma árvore de arquivos com conteúdos de
`assets/projeto-arquivos.js`. O Monitor de hábitos é um app JS puro com dados no
`localStorage`. Guia e página de prompts são **gerados dos mesmos roteiros** (fonte única).

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2017 clássico (sem módulos ES)

**Primary Dependencies**: nenhuma (sem framework, build, CDN ou fontes externas)

**Storage**: `localStorage` — `sdd-sim-v1` (progresso) e `sdd-sim-v1-habitos` (app final)

**Testing**: verificação manual guiada pelo `quickstart.md` no navegador; console sem erros

**Target Platform**: Chrome/Edge atuais no Windows, abrindo por duplo clique (`file://`)

**Project Type**: site estático didático (single project)

**Performance Goals**: interação instantânea; animações ≤ 30 ms/caractere, puláveis

**Constraints**: offline, sem rede, 375px, tema claro/escuro, teclado, nenhuma credencial real

**Scale/Scope**: 6 páginas, ~45 etapas de instalação (2 trilhas), ~15 etapas de projeto

## Constitution Check

| Princípio | Como o plano atende | Status |
|---|---|---|
| I. Offline e sem dependências | Só arquivos locais, `<script src>` clássico, nenhuma requisição | ✅ |
| II. Fidelidade ao workshop | Comandos/prompts copiados literalmente da fonte para `roteiros.js`; selo "saída ilustrativa" no motor; etapas Claude marcadas "conferir na documentação" | ✅ |
| III. Segurança de credenciais | `Sim.ehChaveReal()` roda antes de qualquer eco/histórico/storage; chave de exemplo `sk-or-FALSA-curso-sdd` | ✅ |
| IV. Aprender fazendo | Copiar→colar→validar; dicas por regex; "Mostrar resposta"/"Pular" | ✅ |
| V. Duas trilhas, uma base | Etapas com campo `trilha`; motor e componentes únicos em `assets/` | ✅ |

Re-check pós-design: ✅ sem violações (Complexity Tracking vazio).

## Project Structure

### Documentation (this feature)

```text
specs/001-simulador-workshop/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/roteiro-etapa.md   # formato das etapas e API pública do motor
└── tasks.md
```

### Source Code (repository root)

```text
index.html                    # início: trilha, mapa do curso, progresso, reiniciar
guia/instalacao.html          # guia gerado do roteiro da trilha escolhida
guia/prompts.html             # prompts da prática com Copiar
simulador/instalacao.html     # terminal guiado (cmd/PowerShell/agente)
simulador/projeto.html        # agente + árvore de arquivos + visualizador
simulador/app-final.html      # navegador falso 127.0.0.1:8000 + Monitor de hábitos
assets/sim.css                # tokens (adaptados do curso Claude Code), layout, terminal
assets/sim.js                 # Sim: estado, cabeçalho, copiar, chave, terminalGuiado, arvore
assets/roteiros.js            # window.ROTEIROS = { instalacao:[...], projeto:[...], problemas:{...} }
assets/projeto-arquivos.js    # window.ARQUIVOS = { "caminho@versão": "conteúdo" }
assets/habitos-app.js         # Monitor de hábitos (app final)
README.md                     # apresentação do projeto, como usar e notas para o instrutor
```

**Structure Decision**: projeto único estático na raiz de `sdd-workshop/`, ao lado de
o material do workshop em `_local/material-workshop/` (fonte do conteúdo, fora do repositório). Cada página declara
`<body data-raiz="../" data-pagina="...">` e carrega `roteiros.js`, `projeto-arquivos.js`
(só no projeto), `sim.js` e um script inline de inicialização.

## Complexity Tracking

Sem violações a justificar.
