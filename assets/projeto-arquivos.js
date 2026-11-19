/* Conteúdo ilustrativo dos arquivos gerados na simulação. */
window.ARQUIVOS = {
  ".specify/memory/constitution.md@template": `# [PROJECT_NAME] Constitution
<!-- Exemplo: Constituição do TaskFlow -->

## Core Principles

### [PRINCIPLE_1_NAME]
[PRINCIPLE_1_DESCRIPTION]

### [PRINCIPLE_2_NAME]
[PRINCIPLE_2_DESCRIPTION]

### [PRINCIPLE_3_NAME]
[PRINCIPLE_3_DESCRIPTION]

### [PRINCIPLE_4_NAME]
[PRINCIPLE_4_DESCRIPTION]

### [PRINCIPLE_5_NAME]
[PRINCIPLE_5_DESCRIPTION]

## [SECTION_2_NAME]
<!-- Exemplo: Restrições adicionais, requisitos de segurança... -->
[SECTION_2_CONTENT]

## Governance
<!-- A constituição prevalece sobre outras práticas; emendas exigem registro e nova versão -->
[GOVERNANCE_RULES]

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
`,
  ".specify/templates/spec-template.md@v1": `# Feature Specification: [FEATURE NAME]

**Feature Branch**: \`[###-feature-name]\`
**Created**: [DATE]
**Status**: Draft
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!-- Histórias priorizadas (P1, P2, P3...). Cada uma deve poder ser
     testada sozinha e já entregar valor (MVP). -->

### User Story 1 - [Brief Title] (Priority: P1)

[Descreva a jornada em linguagem simples]

**Why this priority**: [Valor e motivo da prioridade]

**Independent Test**: [Como testar só esta história]

**Acceptance Scenarios**:

1. **Given** [estado inicial], **When** [ação], **Then** [resultado esperado]

---

### Edge Cases

- O que acontece quando [condição de limite]?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST [capacidade específica]
- **FR-002**: System MUST [NEEDS CLARIFICATION: ponto não especificado]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [o que representa, atributos principais, sem implementação]

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: [Métrica mensurável e sem tecnologia]

## Assumptions

- [Premissas assumidas quando a descrição não especificou]

<!-- (versão resumida para a simulação) -->
`,
  ".specify/templates/plan-template.md@v1": `# Implementation Plan: [FEATURE]

**Branch**: \`[###-feature-name]\` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from \`/specs/[###-feature-name]/spec.md\`

## Summary

[Requisito principal + abordagem técnica escolhida]

## Technical Context

**Language/Version**: [ex.: Python 3.12 ou NEEDS CLARIFICATION]
**Primary Dependencies**: [ex.: FastAPI ou NEEDS CLARIFICATION]
**Storage**: [se houver: arquivos, banco... ou N/A]
**Testing**: [ex.: pytest ou NEEDS CLARIFICATION]
**Target Platform**: [ex.: Windows, Linux server...]
**Project Type**: [ex.: web-service, cli, desktop-app...]
**Constraints**: [ex.: offline, <200ms...]
**Scale/Scope**: [ex.: 1 usuário, 10k registros...]

## Constitution Check

*GATE: precisa passar antes da Fase 0 e ser revisto após a Fase 1.*

[Portões derivados de .specify/memory/constitution.md]

## Project Structure

### Documentation (this feature)

\`\`\`text
specs/[###-feature]/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md   # gerado por /speckit.tasks
\`\`\`

### Source Code (repository root)

[Árvore real de pastas e arquivos deste projeto]

**Structure Decision**: [Estrutura escolhida e por quê]

## Complexity Tracking

> Preencha SÓ se o Constitution Check tiver violações que precisem de justificativa.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

<!-- (versão resumida para a simulação) -->
`,
  ".specify/templates/tasks-template.md@v1": `---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from \`/specs/[###-feature-name]/\`
**Prerequisites**: plan.md (required), spec.md (required for user stories)
**Tests**: OPCIONAIS — só inclua se a spec pedir.
**Organization**: tarefas agrupadas por história de usuário.

## Format: \`[ID] [P?] [Story] Description\`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: história atendida (US1, US2, US3...)
- Inclua o caminho exato dos arquivos

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Criar a estrutura do projeto conforme o plano

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T002 [Infraestrutura que bloqueia todas as histórias]

**Checkpoint**: base pronta — as histórias podem começar

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [o que esta história entrega]
**Independent Test**: [como verificar sozinha]

- [ ] T003 [US1] [Implementação em caminho/arquivo]

**Checkpoint**: História 1 funcional e testável sozinha

## Phase N: Polish & Cross-Cutting Concerns

- [ ] TXXX [Documentação, limpeza, validação do quickstart.md]

<!-- (versão resumida para a simulação) -->
`,
  ".opencode/command/speckit.specify.md@v1": `---
description: Cria ou atualiza a especificação da funcionalidade a partir de uma descrição em linguagem natural.
---

## Entrada do usuário

\`\`\`text
$ARGUMENTS
\`\`\`

Considere a entrada acima antes de prosseguir (se não estiver vazia).

## Roteiro

1. Gere um nome curto (2 a 4 palavras) para a funcionalidade e crie a pasta
   \`specs/NNN-nome-curto/\` com o próximo número livre.
2. Carregue \`.specify/templates/spec-template.md\` para seguir as seções obrigatórias.
3. Escreva \`spec.md\` focando em O QUÊ e POR QUÊ — nunca em COMO
   (sem linguagem, framework ou formato de arquivo).
4. Marque no máximo 3 pontos ambíguos com \`[NEEDS CLARIFICATION: ...]\`.
5. Gere \`checklists/requirements.md\` e valide a spec contra ele.
6. Informe a pasta criada e sugira o próximo passo: \`/speckit.clarify\` ou \`/speckit.plan\`.

<!-- Arquivo ilustrativo e resumido (OpenCode lê comandos de .opencode/command/). -->
`,
  ".claude/skills/speckit-specify/SKILL.md@v1": `---
name: speckit-specify
description: Cria ou atualiza a especificação da funcionalidade a partir de uma descrição em linguagem natural.
---

# Spec Kit · specify

Use esta skill quando a pessoa pedir \`/speckit-specify <descrição>\`.

## Passos

1. Escolha um nome curto e crie \`specs/NNN-nome-curto/\`.
2. Siga \`.specify/templates/spec-template.md\`.
3. Descreva O QUÊ e POR QUÊ, sem detalhes de tecnologia.
4. Use \`[NEEDS CLARIFICATION: ...]\` para no máximo 3 dúvidas importantes.
5. Crie \`checklists/requirements.md\` e valide a spec.
6. Ao terminar, sugira \`/speckit-clarify\` ou \`/speckit-plan\`.

<!-- Arquivo ilustrativo e resumido (Claude Code lê skills de .claude/skills/). -->
`,
  "pyproject.toml@v1": `[project]
name = "sdd-workshop"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.12"
dependencies = []
`,
  ".python-version@v1": `3.12
`,
  "main.py@init": `def main():
    print("Hello from sdd-workshop!")


if __name__ == "__main__":
    main()
`,
  "README.md@init": ``,
  ".gitignore@v1": `# Python-generated files
__pycache__/
*.py[oc]
build/
dist/
wheels/
*.egg-info

# Virtual environments
.venv
data/
`,
  ".specify/memory/constitution.md@v1": `<!--
Relatório de sincronização
- Versão: modelo → 1.0.0 (primeira ratificação)
- Princípios adicionados: I. Simplicidade, II. Local e offline, III. Dados do usuário,
  IV. Para iniciantes, V. Fácil de rodar
- Seções adicionadas: Restrições
- Modelos conferidos: plan-template.md ✅ · spec-template.md ✅ · tasks-template.md ✅
- Pendências: nenhuma
-->
# Constituição do Monitor de Hábitos

Monitor de hábitos pessoal, usado por uma pessoa no próprio computador.

## Core Principles

### I. Simplicidade

O projeto usa o mínimo de arquivos e dependências. Não há framework de frontend
nem etapa de build. Entre duas soluções, escolhe-se a mais fácil de entender para
quem nunca programou.

### II. Local e offline

O app roda só em 127.0.0.1, sem login, sem banco de dados e sem nuvem. O app não
chama a internet, nem modelos de IA, nem nenhum serviço externo.

### III. Dados do usuário

Os dados ficam num arquivo JSON legível dentro da pasta do projeto. Nada é apagado
sem confirmação explícita, e a gravação nunca pode deixar o arquivo corrompido.

### IV. Para iniciantes

Interface e mensagens em português do Brasil. Todo erro diz o que fazer em seguida.
Comentários curtos no código explicam a intenção, não o óbvio.

### V. Fácil de rodar

Um único comando sobe o app, e ele está documentado no README. Esta versão não tem
testes automatizados; a conferência é manual, descrita em cada tarefa.

## Restrições

- Windows sem permissão de administrador, terminal cmd.
- Python 3.12 gerenciado pelo uv.
- A spec é a fonte da verdade: toda mudança de requisito começa nela, depois
  passa pelo plano, pelas tarefas e só então pelo código.

## Governance

Esta constituição prevalece sobre preferências de implementação. Cada plano passa
pelo Constitution Check; qualquer violação precisa ser justificada em
"Complexity Tracking" ou o plano deve ser simplificado. Emendas são registradas
neste arquivo com nova versão (semântica: MAJOR.MINOR.PATCH).

**Version**: 1.0.0 | **Ratified**: 2026-11-19 | **Last Amended**: 2026-11-19
`,
  "specs/001-monitor-habitos/spec.md@v1": `# Feature Specification: Monitor de hábitos pessoal

**Feature Branch**: \`001-monitor-habitos\`
**Created**: 2026-11-19
**Status**: Draft
**Input**: User description: "Quero um monitor de hábitos pessoal: minimalista, flexível e muito simples de usar..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Grade da semana e marcação com um clique (Priority: P1)

A pessoa abre o app, cria um hábito digitando só o nome e vê uma grade com os
hábitos nas linhas e os últimos 7 dias nas colunas. Um clique marca o dia como
feito; outro clique desmarca.

**Why this priority**: é o coração do app; sozinha, já permite acompanhar hábitos.

**Independent Test**: criar "Beber água", marcar hoje, fechar e reabrir o app: a
marcação continua lá.

**Acceptance Scenarios**:

1. **Given** nenhum hábito, **When** digito "Ler" e confirmo, **Then** "Ler" aparece na grade.
2. **Given** um hábito com hoje vazio, **When** clico na célula de hoje, **Then** ela fica marcada.
3. **Given** um dia marcado, **When** clico nele de novo, **Then** ele fica desmarcado.

---

### User Story 2 - Sequência e frequência (Priority: P2)

Para cada hábito, a pessoa vê a sequência atual (dias seguidos) e a frequência
dos últimos 30 dias, em porcentagem.

**Why this priority**: mostra o progresso e motiva, mas depende da marcação (P1).

**Independent Test**: marcar 3 dias seguidos e conferir sequência 3 e frequência 10%.

**Acceptance Scenarios**:

1. **Given** ontem e anteontem marcados, **When** abro o app, **Then** vejo a sequência do hábito.
2. **Given** 15 dias marcados nos últimos 30, **When** abro o app, **Then** vejo 50%.

---

### User Story 3 - Semanas anteriores e gestão de hábitos (Priority: P3)

A pessoa volta a semanas anteriores e corrige dias passados à mão. Também pode
renomear, arquivar e excluir hábitos; excluir pede confirmação.

**Why this priority**: corrige esquecimentos e mantém a grade organizada.

**Independent Test**: voltar uma semana, marcar um dia e ver a frequência mudar;
tentar marcar amanhã e não conseguir.

**Acceptance Scenarios**:

1. **Given** a semana atual, **When** clico em "Semana anterior", **Then** vejo os 7 dias anteriores.
2. **Given** um hábito, **When** clico em excluir e cancelo, **Then** nada é apagado.

---

### Edge Cases

- Criar hábito com nome vazio: o app recusa e diz o que fazer.
- Tentar marcar um dia futuro: não é possível.
- Arquivo de dados ausente na primeira execução: o app começa vazio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE mostrar uma grade com os hábitos ativos nas linhas e 7 dias nas colunas.
- **FR-002**: A pessoa DEVE conseguir criar um hábito informando só o nome.
- **FR-003**: Um clique DEVE marcar o dia; outro clique DEVE desmarcar. A mudança é salva na hora.
- **FR-004**: O sistema DEVE mostrar a sequência atual de cada hábito [NEEDS CLARIFICATION: o dia de hoje ainda sem marcação quebra a sequência?]
- **FR-005**: O sistema DEVE mostrar a frequência dos últimos 30 dias, em %.
- **FR-006**: A pessoa DEVE conseguir navegar para semanas anteriores e corrigir dias passados.
- **FR-007**: O sistema NÃO DEVE permitir marcar dias futuros.
- **FR-008**: Os dados DEVEM continuar salvos após fechar e reabrir, num arquivo legível da pasta do projeto.
- **FR-009**: Tudo DEVE funcionar sem internet.
- **FR-010**: A pessoa DEVE conseguir renomear um hábito.
- **FR-011**: A pessoa DEVE conseguir arquivar um hábito [NEEDS CLARIFICATION: qual a diferença entre arquivar e excluir? o histórico é mantido?]
- **FR-012**: A pessoa DEVE conseguir excluir um hábito, só depois de confirmar.
- **FR-013**: Textos e mensagens DEVEM estar em português do Brasil; todo erro diz o que fazer.

### Key Entities

- **Hábito**: nome, situação (ativo ou arquivado) e o conjunto de dias marcados como feitos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Quem nunca viu o app cria um hábito e marca hoje em menos de 1 minuto.
- **SC-002**: Marcar ou desmarcar leva exatamente 1 clique.
- **SC-003**: 100% das marcações continuam lá depois de fechar e reabrir.
- **SC-004**: O app funciona com a internet desligada.

## Assumptions

- Uma pessoa, um computador, sem login.
- A frequência considera os últimos 30 dias, contando hoje, e divide sempre por 30.
- Nomes repetidos são permitidos.

## Out of Scope

Metas semanais, lembretes, análise com IA, vários usuários, celular e sincronização.
`,
  "specs/001-monitor-habitos/checklists/requirements.md@v1": `# Specification Quality Checklist: Monitor de hábitos pessoal

**Purpose**: validar a completude e a qualidade da spec antes do planejamento
**Created**: 2026-11-19
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] Sem detalhes de implementação (linguagem, framework, formato de arquivo)
- [x] Foco no valor para a pessoa usuária
- [x] Escrita para quem não é técnico
- [x] Todas as seções obrigatórias preenchidas

## Requirement Completeness

- [ ] Nenhum marcador [NEEDS CLARIFICATION] restante
- [x] Requisitos testáveis e sem ambiguidade
- [x] Critérios de sucesso mensuráveis
- [x] Critérios de sucesso sem tecnologia
- [x] Casos de borda identificados
- [x] Escopo delimitado (seção Out of Scope)
- [x] Premissas registradas

## Feature Readiness

- [x] Cada requisito tem critério de aceite claro
- [x] Histórias cobrem os fluxos principais
- [x] Nenhum detalhe de implementação vazou para a spec

## Notes

- 2 marcadores pendentes: definição de sequência (FR-004) e arquivar × excluir (FR-011).
  Resolver com \`/speckit.clarify\` antes de \`/speckit.plan\`.
`,
  "specs/001-monitor-habitos/spec.md@clarify": `# Feature Specification: Monitor de hábitos pessoal

**Feature Branch**: \`001-monitor-habitos\`
**Created**: 2026-11-19
**Status**: Draft
**Input**: User description: "Quero um monitor de hábitos pessoal: minimalista, flexível e muito simples de usar..."

## Clarifications

### Session 2026-11-19

- Q: O que conta como sequência? → A: Dias seguidos marcados até ontem. Hoje ainda sem marcação não quebra a sequência; se hoje estiver marcado, soma 1.
- Q: Qual a diferença entre arquivar e excluir? → A: Arquivar esconde o hábito da grade e guarda o histórico (dá para desarquivar). Excluir apaga o hábito e todo o histórico, depois de confirmar.
- Decisão assumida (opção mais simples): a grade mostra 7 dias seguidos terminando no dia escolhido, não uma semana de calendário.
- Decisão assumida (opção mais simples): a frequência divide sempre por 30, mesmo para hábitos criados há menos tempo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Grade da semana e marcação com um clique (Priority: P1)

A pessoa abre o app, cria um hábito digitando só o nome e vê uma grade com os
hábitos nas linhas e os últimos 7 dias nas colunas. Um clique marca o dia como
feito; outro clique desmarca.

**Why this priority**: é o coração do app; sozinha, já permite acompanhar hábitos.

**Independent Test**: criar "Beber água", marcar hoje, fechar e reabrir o app: a
marcação continua lá.

**Acceptance Scenarios**:

1. **Given** nenhum hábito, **When** digito "Ler" e confirmo, **Then** "Ler" aparece na grade.
2. **Given** um hábito com hoje vazio, **When** clico na célula de hoje, **Then** ela fica marcada.
3. **Given** um dia marcado, **When** clico nele de novo, **Then** ele fica desmarcado.

---

### User Story 2 - Sequência e frequência (Priority: P2)

Para cada hábito, a pessoa vê a sequência atual (dias seguidos) e a frequência
dos últimos 30 dias, em porcentagem.

**Why this priority**: mostra o progresso e motiva, mas depende da marcação (P1).

**Independent Test**: marcar ontem e anteontem (hoje vazio) e conferir sequência 2.

**Acceptance Scenarios**:

1. **Given** ontem e anteontem marcados e hoje vazio, **When** abro o app, **Then** a sequência é 2.
2. **Given** ontem, anteontem e hoje marcados, **When** abro o app, **Then** a sequência é 3.
3. **Given** 15 dias marcados nos últimos 30, **When** abro o app, **Then** vejo 50%.

---

### User Story 3 - Semanas anteriores e gestão de hábitos (Priority: P3)

A pessoa volta a semanas anteriores e corrige dias passados à mão. Também pode
renomear, arquivar e excluir hábitos; excluir pede confirmação.

**Why this priority**: corrige esquecimentos e mantém a grade organizada.

**Independent Test**: voltar uma semana, marcar um dia e ver a frequência mudar;
tentar marcar amanhã e não conseguir.

**Acceptance Scenarios**:

1. **Given** a semana atual, **When** clico em "Semana anterior", **Then** vejo os 7 dias anteriores.
2. **Given** um hábito arquivado, **When** desarquivo, **Then** ele volta com todo o histórico.
3. **Given** um hábito, **When** clico em excluir e cancelo, **Then** nada é apagado.

---

### Edge Cases

- Criar hábito com nome vazio: o app recusa e diz o que fazer.
- Tentar marcar um dia futuro: não é possível.
- Arquivo de dados ausente na primeira execução: o app começa vazio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE mostrar uma grade com os hábitos ativos nas linhas e 7 dias nas colunas.
- **FR-002**: A pessoa DEVE conseguir criar um hábito informando só o nome.
- **FR-003**: Um clique DEVE marcar o dia; outro clique DEVE desmarcar. A mudança é salva na hora.
- **FR-004**: O sistema DEVE mostrar a sequência atual: dias seguidos marcados até ontem, somando hoje se estiver marcado. Hoje sem marcação não quebra a sequência.
- **FR-005**: O sistema DEVE mostrar a frequência dos últimos 30 dias (contando hoje), em %.
- **FR-006**: A pessoa DEVE conseguir navegar para semanas anteriores e corrigir dias passados.
- **FR-007**: O sistema NÃO DEVE permitir marcar dias futuros.
- **FR-008**: Os dados DEVEM continuar salvos após fechar e reabrir, num arquivo legível da pasta do projeto.
- **FR-009**: Tudo DEVE funcionar sem internet.
- **FR-010**: A pessoa DEVE conseguir renomear um hábito.
- **FR-011**: A pessoa DEVE conseguir arquivar um hábito: ele sai da grade, o histórico é guardado e é possível desarquivar.
- **FR-012**: A pessoa DEVE conseguir excluir um hábito, o que apaga também o histórico, só depois de confirmar.
- **FR-013**: Textos e mensagens DEVEM estar em português do Brasil; todo erro diz o que fazer.

### Key Entities

- **Hábito**: nome, situação (ativo ou arquivado) e o conjunto de dias marcados como feitos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Quem nunca viu o app cria um hábito e marca hoje em menos de 1 minuto.
- **SC-002**: Marcar ou desmarcar leva exatamente 1 clique.
- **SC-003**: 100% das marcações continuam lá depois de fechar e reabrir.
- **SC-004**: O app funciona com a internet desligada.

## Assumptions

- Uma pessoa, um computador, sem login.
- A frequência considera os últimos 30 dias, contando hoje, e divide sempre por 30.
- Nomes repetidos são permitidos.

## Out of Scope

Metas semanais, lembretes, análise com IA, vários usuários, celular e sincronização.
`,
  "specs/001-monitor-habitos/plan.md@v1": `# Implementation Plan: Monitor de hábitos pessoal

**Branch**: \`001-monitor-habitos\` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from \`/specs/001-monitor-habitos/spec.md\`

## Summary

Grade de hábitos × 7 dias com marcação em um clique, sequência e frequência.
Um servidor local em Python entrega uma página estática (HTML, CSS e JS puros) e
uma API JSON pequena que lê e grava \`data/habitos.json\`.

## Technical Context

**Language/Version**: Python 3.12 (gerenciado pelo uv); JavaScript puro no navegador
**Primary Dependencies**: FastAPI e Uvicorn (instalados com \`uv add fastapi uvicorn\`)
**Storage**: arquivo \`data/habitos.json\`, criado vazio se não existir; gravação atômica
**Testing**: nenhum teste automatizado (Princípio V); conferência manual por tarefa
**Target Platform**: Windows, navegador local em http://127.0.0.1:8000
**Project Type**: web app local (servidor + página estática)
**Constraints**: offline, só 127.0.0.1, sem build, sem login
**Scale/Scope**: 1 pessoa, dezenas de hábitos, alguns anos de marcações

## Constitution Check

| Princípio | Como o plano atende | Status |
|-----------|---------------------|--------|
| I. Simplicidade | 1 arquivo Python + 3 arquivos estáticos; 2 dependências; sem build | ✅ |
| II. Local e offline | Uvicorn escuta só em 127.0.0.1; nenhuma chamada externa | ✅ |
| III. Dados do usuário | JSON legível; excluir pede confirmação; temporário + \`os.replace\` | ✅ |
| IV. Para iniciantes | Textos em pt-BR; erros com "o que fazer"; comentários curtos | ✅ |
| V. Fácil de rodar | \`uv run python main.py\`, documentado no README; sem testes | ✅ |

## Project Structure

### Documentation (this feature)

\`\`\`text
specs/001-monitor-habitos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api.md
└── tasks.md
\`\`\`

### Source Code (repository root)

\`\`\`text
main.py              # servidor FastAPI: página + API JSON + leitura/gravação
static/
├── index.html       # estrutura da página
├── style.css        # aparência
└── app.js           # grade, cálculos e chamadas à API
data/
└── habitos.json     # dados (fora do git, criado automaticamente)
\`\`\`

**Structure Decision**: projeto único na raiz, sem pastas \`src/\` nem \`tests/\`.
Sequência e frequência são calculadas no navegador a partir dos dias marcados.

## Alternativas descartadas

| Alternativa | Motivo |
|-------------|--------|
| SQLite | O arquivo não é legível sem ferramenta extra (Princípio III) e adiciona conceitos de banco (Princípio I). |
| React (ou outro framework) | Exige build e muitas dependências; contradiz o Princípio I. |
| Guardar no navegador (localStorage) | Os dados ficariam escondidos no navegador, fora da pasta do projeto, e se perdem ao limpar o histórico (Princípio III). |

## Complexity Tracking

Nenhuma violação da constituição.
`,
  "specs/001-monitor-habitos/research.md@v1": `# Research: Monitor de hábitos pessoal

**Date**: 2026-11-19

## Decisão 1: servidor local

- **Decision**: FastAPI servido pelo Uvicorn em 127.0.0.1:8000.
- **Rationale**: poucas linhas para servir arquivos estáticos e uma API JSON;
  instala com \`uv add\`, sem permissão de administrador.
- **Alternatives considered**: \`http.server\` da biblioteca padrão (exigiria
  tratar rotas e JSON à mão, código mais longo para iniciantes).

## Decisão 2: gravação sem corromper

- **Decision**: gravar num arquivo temporário na mesma pasta e trocar com \`os.replace\`.
- **Rationale**: a troca é atômica; se o app cair no meio, o arquivo antigo continua inteiro.
- **Alternatives considered**: gravar direto no arquivo (pode deixar JSON pela metade).

## Decisão 3: datas

- **Decision**: datas como texto \`AAAA-MM-DD\`, no horário local do computador.
- **Rationale**: legível no JSON, ordena corretamente como texto, sem fuso horário.

## Decisão 4: onde calcular sequência e frequência

- **Decision**: no navegador (\`app.js\`), a partir da lista de dias.
- **Rationale**: a API fica mínima e o arquivo guarda só fatos (dias feitos), nada derivado.

## Decisão 5: concorrência

- **Decision**: uma trava (\`threading.Lock\`) em volta de "ler, alterar, gravar".
- **Rationale**: evita que dois cliques rápidos sobrescrevam um ao outro.
`,
  "specs/001-monitor-habitos/data-model.md@v1": `# Data Model: Monitor de hábitos pessoal

## Arquivo

\`data/habitos.json\` — UTF-8, indentado, legível em qualquer editor de texto.
Se não existir, é criado com:

\`\`\`json
{ "versao": 1, "habitos": [] }
\`\`\`

## Entidade: Hábito

| Campo | Tipo | Regra |
|-------|------|-------|
| \`id\` | texto | gerado pelo servidor (8 caracteres), nunca muda |
| \`nome\` | texto | obrigatório, 1 a 60 caracteres, sem espaços nas pontas |
| \`arquivado\` | booleano | \`false\` ao criar; \`true\` esconde da grade (FR-011) |
| \`criado_em\` | texto \`AAAA-MM-DD\` | data de criação |
| \`dias\` | lista de textos \`AAAA-MM-DD\` | dias feitos, ordenados, sem repetição, nunca no futuro |

## Exemplo

\`\`\`json
{
  "versao": 1,
  "habitos": [
    {
      "id": "a1b2c3d4",
      "nome": "Beber água",
      "arquivado": false,
      "criado_em": "2026-11-10",
      "dias": ["2026-11-17", "2026-11-18", "2026-11-19"]
    }
  ]
}
\`\`\`

## Valores derivados (não gravados)

- **Sequência** (FR-004): dias seguidos marcados até ontem, +1 se hoje estiver marcado.
- **Frequência** (FR-005): dias marcados entre hoje−29 e hoje ÷ 30, em %.

## Transições

- ativo → arquivado → ativo (histórico preservado)
- ativo/arquivado → excluído (removido do arquivo, após confirmação)
`,
  "specs/001-monitor-habitos/contracts/api.md@v1": `# Contrato da API

Base: \`http://127.0.0.1:8000\`. Corpo e respostas em JSON. Erros retornam
\`{"detail": "mensagem em português dizendo o que fazer"}\`.

| Método | Caminho | Corpo | Resposta | Requisito |
|--------|---------|-------|----------|-----------|
| GET | \`/\` | — | página \`index.html\` | FR-001 |
| GET | \`/api/habitos\` | — | \`200\` \`{"versao": 1, "habitos": [...]}\` | FR-001, FR-008 |
| POST | \`/api/habitos\` | \`{"nome": "Ler"}\` | \`201\` hábito criado | FR-002 |
| PATCH | \`/api/habitos/{id}\` | \`{"nome"?: "...", "arquivado"?: true}\` | \`200\` hábito | FR-010, FR-011 |
| DELETE | \`/api/habitos/{id}\` | — | \`204\` sem corpo | FR-012 |
| POST | \`/api/habitos/{id}/dias/{data}\` | — | \`200\` hábito (dia alternado) | FR-003, FR-006, FR-007 |

## Regras

- \`{data}\` no formato \`AAAA-MM-DD\`. Se o dia já estiver em \`dias\`, é removido;
  senão, é incluído (alternar).
- Data futura → \`400\` "Não dá para marcar um dia futuro...".
- Data inválida → \`400\` "Data inválida. Use o formato AAAA-MM-DD...".
- Nome vazio ou com mais de 60 caracteres → \`400\`.
- \`id\` inexistente → \`404\` "Hábito não encontrado. Recarregue a página."
- A confirmação de exclusão acontece na página, antes do \`DELETE\`.
`,
  "specs/001-monitor-habitos/quickstart.md@v1": `# Quickstart: Monitor de hábitos pessoal

## Rodar

No cmd, dentro da pasta \`sdd-workshop\`:

\`\`\`bat
uv run python main.py
\`\`\`

Abra http://127.0.0.1:8000 no navegador. Para parar: Ctrl+C no cmd.

## Roteiro de conferência manual

1. **US1**: digite "Beber água", clique em Criar, clique na célula de hoje → fica marcada.
   Clique de novo → desmarca. Marque de novo, pare o app, suba outra vez e recarregue → continua marcada.
2. Abra \`data/habitos.json\` num editor de texto → o hábito e a data de hoje estão lá.
3. **US2**: marque ontem e anteontem → a sequência mostra 3 dias (2 se hoje estiver vazio).
4. **US3**: clique em "Semana anterior", marque um dia → a frequência sobe.
   O botão de amanhã nunca aparece habilitado.
5. Renomeie, arquive (some da grade e aparece em "Arquivados"), desarquive,
   e exclua cancelando a confirmação (nada muda) e depois confirmando (some).
6. Desligue a internet e repita o passo 1 → tudo funciona.
`,
  "specs/001-monitor-habitos/tasks.md@v1": `---
description: "Lista de tarefas do monitor de hábitos"
---

# Tasks: Monitor de hábitos pessoal

**Input**: Design documents from \`/specs/001-monitor-habitos/\`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md
**Tests**: sem testes automatizados (constituição, Princípio V). Cada tarefa tem um "Conferir:" manual.
**Organization**: por história de usuário; MVP (US1) primeiro.

## Phase 1: Setup

- [ ] T001 Instalar dependências com \`uv add fastapi uvicorn\` (pyproject.toml) — plano
  - Conferir: \`pyproject.toml\` lista fastapi e uvicorn em \`dependencies\`.
- [ ] T002 Criar a pasta \`static/\` e confirmar \`data/\` no \`.gitignore\` — FR-008
  - Conferir: a pasta existe e \`.gitignore\` termina com \`data/\`.

## Phase 2: Foundational

- [ ] T003 Em \`main.py\`: app FastAPI, ler/criar \`data/habitos.json\`, gravação atômica (temporário + \`os.replace\`), servir \`static/\` e \`/\`, Uvicorn em 127.0.0.1:8000 — FR-008, FR-009
  - Conferir: \`uv run python main.py\` sobe sem erro e cria \`data/habitos.json\` com \`{"versao": 1, "habitos": []}\`.

**Checkpoint**: servidor no ar.

## Phase 3: User Story 1 - Grade e marcação (Priority: P1) 🎯 MVP

- [ ] T004 [US1] Em \`main.py\`: \`GET /api/habitos\`, \`POST /api/habitos\` e \`POST /api/habitos/{id}/dias/{data}\` (alternar) — FR-002, FR-003
  - Conferir: criar um hábito pela página e ver o registro em \`data/habitos.json\`.
- [ ] T005 [P] [US1] Criar \`static/index.html\` e \`static/style.css\` (formulário, navegação, tabela, área de mensagens) — FR-001, FR-013
  - Conferir: a página abre em http://127.0.0.1:8000 com textos em português.
- [ ] T006 [US1] Em \`static/app.js\`: carregar hábitos, desenhar a grade × 7 dias, criar hábito e alternar dia com 1 clique — FR-001, FR-002, FR-003, SC-001
  - Conferir: criar "Beber água" e marcar hoje em menos de 1 minuto; recarregar e continuar marcado.

**Checkpoint**: MVP pronto — a US1 funciona sozinha.

## Phase 4: User Story 2 - Sequência e frequência (Priority: P2)

- [ ] T007 [US2] Em \`static/app.js\`: colunas de sequência (até ontem, +1 se hoje marcado) e frequência de 30 dias — FR-004, FR-005
  - Conferir: ontem e anteontem marcados, hoje vazio → "2 dias"; marcar hoje → "3 dias" e 10%.

## Phase 5: User Story 3 - Semanas anteriores e gestão (Priority: P3)

- [ ] T008 [US3] Em \`static/app.js\`: botões Semana anterior / Hoje / Próxima semana; dias futuros desabilitados. Em \`main.py\`: recusar data futura — FR-006, FR-007
  - Conferir: voltar uma semana e marcar um dia; a célula de amanhã nunca é clicável.
- [ ] T009 [US3] Em \`main.py\`: \`PATCH\` e \`DELETE /api/habitos/{id}\`. Em \`static/app.js\`: renomear, arquivar/desarquivar e excluir com confirmação — FR-010, FR-011, FR-012
  - Conferir: arquivar some da grade e aparece em "Arquivados"; excluir e cancelar não apaga nada.

## Phase 6: Polish

- [ ] T010 Escrever \`README.md\` com o comando \`uv run python main.py\` e o endereço; revisar mensagens de erro em pt-BR — FR-013
  - Conferir: seguir \`quickstart.md\` do início ao fim sem travar.

## Dependencies

Setup → Foundational → US1 → US2 → US3 → Polish. T005 pode ser feita em paralelo com T004.
`,
  "specs/001-monitor-habitos/tasks.md@feito": `---
description: "Lista de tarefas do monitor de hábitos"
---

# Tasks: Monitor de hábitos pessoal

**Input**: Design documents from \`/specs/001-monitor-habitos/\`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md
**Tests**: sem testes automatizados (constituição, Princípio V). Cada tarefa tem um "Conferir:" manual.
**Organization**: por história de usuário; MVP (US1) primeiro.

## Phase 1: Setup

- [X] T001 Instalar dependências com \`uv add fastapi uvicorn\` (pyproject.toml) — plano
  - Conferir: \`pyproject.toml\` lista fastapi e uvicorn em \`dependencies\`.
- [X] T002 Criar a pasta \`static/\` e confirmar \`data/\` no \`.gitignore\` — FR-008
  - Conferir: a pasta existe e \`.gitignore\` termina com \`data/\`.

## Phase 2: Foundational

- [X] T003 Em \`main.py\`: app FastAPI, ler/criar \`data/habitos.json\`, gravação atômica (temporário + \`os.replace\`), servir \`static/\` e \`/\`, Uvicorn em 127.0.0.1:8000 — FR-008, FR-009
  - Conferir: \`uv run python main.py\` sobe sem erro e cria \`data/habitos.json\` com \`{"versao": 1, "habitos": []}\`.

**Checkpoint**: servidor no ar.

## Phase 3: User Story 1 - Grade e marcação (Priority: P1) 🎯 MVP

- [X] T004 [US1] Em \`main.py\`: \`GET /api/habitos\`, \`POST /api/habitos\` e \`POST /api/habitos/{id}/dias/{data}\` (alternar) — FR-002, FR-003
  - Conferir: criar um hábito pela página e ver o registro em \`data/habitos.json\`.
- [X] T005 [P] [US1] Criar \`static/index.html\` e \`static/style.css\` (formulário, navegação, tabela, área de mensagens) — FR-001, FR-013
  - Conferir: a página abre em http://127.0.0.1:8000 com textos em português.
- [X] T006 [US1] Em \`static/app.js\`: carregar hábitos, desenhar a grade × 7 dias, criar hábito e alternar dia com 1 clique — FR-001, FR-002, FR-003, SC-001
  - Conferir: criar "Beber água" e marcar hoje em menos de 1 minuto; recarregar e continuar marcado.

**Checkpoint**: MVP pronto — a US1 funciona sozinha.

## Phase 4: User Story 2 - Sequência e frequência (Priority: P2)

- [X] T007 [US2] Em \`static/app.js\`: colunas de sequência (até ontem, +1 se hoje marcado) e frequência de 30 dias — FR-004, FR-005
  - Conferir: ontem e anteontem marcados, hoje vazio → "2 dias"; marcar hoje → "3 dias" e 10%.

## Phase 5: User Story 3 - Semanas anteriores e gestão (Priority: P3)

- [X] T008 [US3] Em \`static/app.js\`: botões Semana anterior / Hoje / Próxima semana; dias futuros desabilitados. Em \`main.py\`: recusar data futura — FR-006, FR-007
  - Conferir: voltar uma semana e marcar um dia; a célula de amanhã nunca é clicável.
- [X] T009 [US3] Em \`main.py\`: \`PATCH\` e \`DELETE /api/habitos/{id}\`. Em \`static/app.js\`: renomear, arquivar/desarquivar e excluir com confirmação — FR-010, FR-011, FR-012
  - Conferir: arquivar some da grade e aparece em "Arquivados"; excluir e cancelar não apaga nada.

## Phase 6: Polish

- [X] T010 Escrever \`README.md\` com o comando \`uv run python main.py\` e o endereço; revisar mensagens de erro em pt-BR — FR-013
  - Conferir: seguir \`quickstart.md\` do início ao fim sem travar.

## Dependencies

Setup → Foundational → US1 → US2 → US3 → Polish. T005 pode ser feita em paralelo com T004.
`,
  "pyproject.toml@impl": `[project]
name = "sdd-workshop"
version = "0.1.0"
description = "Monitor de hábitos pessoal, local e offline"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.121.2",
    "uvicorn>=0.38.0",
]
`,
  "main.py@v1": `"""Monitor de hábitos: servidor local que entrega a página e uma pequena API JSON.

Rodar:  uv run python main.py   ->   abrir http://127.0.0.1:8000
"""

import json
import os
import tempfile
import threading
import uuid
from datetime import date
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Caminhos a partir da pasta do projeto (funciona de qualquer cmd).
PASTA = Path(__file__).resolve().parent
ARQUIVO_DADOS = PASTA / "data" / "habitos.json"
PASTA_STATIC = PASTA / "static"
TAMANHO_MAX_NOME = 60

# Evita que duas gravações simultâneas sobrescrevam uma à outra.
TRAVA = threading.Lock()

app = FastAPI(title="Monitor de hábitos")


# ---------- Leitura e gravação do arquivo ----------

def salvar(dados: dict) -> None:
    """Grava num arquivo temporário e só depois troca pelo original (não corrompe)."""
    ARQUIVO_DADOS.parent.mkdir(exist_ok=True)
    descritor, caminho_tmp = tempfile.mkstemp(dir=ARQUIVO_DADOS.parent, suffix=".tmp")
    try:
        with os.fdopen(descritor, "w", encoding="utf-8") as arquivo:
            json.dump(dados, arquivo, ensure_ascii=False, indent=2)
            arquivo.flush()
            os.fsync(arquivo.fileno())
        os.replace(caminho_tmp, ARQUIVO_DADOS)  # troca atômica
    except BaseException:
        # Deu errado: apaga o temporário; o arquivo antigo continua intacto.
        if os.path.exists(caminho_tmp):
            os.remove(caminho_tmp)
        raise


def carregar() -> dict:
    """Lê os dados; se o arquivo ainda não existe, cria um vazio."""
    if not ARQUIVO_DADOS.exists():
        salvar({"versao": 1, "habitos": []})
    try:
        with open(ARQUIVO_DADOS, encoding="utf-8") as arquivo:
            return json.load(arquivo)
    except json.JSONDecodeError:
        raise HTTPException(
            500,
            "O arquivo data/habitos.json está com erro de formato. "
            "Corrija o trecho quebrado (ou restaure uma cópia) e recarregue a página.",
        )


def validar_nome(nome: str) -> str:
    """Tira espaços das pontas e confere o tamanho do nome."""
    nome = nome.strip()
    if not nome:
        raise HTTPException(400, "Digite um nome para o hábito.")
    if len(nome) > TAMANHO_MAX_NOME:
        raise HTTPException(400, f"Use um nome com até {TAMANHO_MAX_NOME} caracteres.")
    return nome


def buscar(dados: dict, habito_id: str) -> dict:
    """Encontra o hábito pelo id ou responde 404."""
    for habito in dados["habitos"]:
        if habito["id"] == habito_id:
            return habito
    raise HTTPException(404, "Hábito não encontrado. Recarregue a página.")


# ---------- Formatos aceitos pela API ----------

class NovoHabito(BaseModel):
    nome: str


class AlteracaoHabito(BaseModel):
    nome: str | None = None
    arquivado: bool | None = None


# ---------- API (contracts/api.md) ----------

@app.get("/api/habitos")
def listar_habitos():
    with TRAVA:
        return carregar()


@app.post("/api/habitos", status_code=201)
def criar_habito(novo: NovoHabito):
    nome = validar_nome(novo.nome)
    with TRAVA:
        dados = carregar()
        habito = {
            "id": uuid.uuid4().hex[:8],
            "nome": nome,
            "arquivado": False,
            "criado_em": date.today().isoformat(),
            "dias": [],
        }
        dados["habitos"].append(habito)
        salvar(dados)
    return habito


@app.patch("/api/habitos/{habito_id}")
def alterar_habito(habito_id: str, alteracao: AlteracaoHabito):
    with TRAVA:
        dados = carregar()
        habito = buscar(dados, habito_id)
        if alteracao.nome is not None:
            habito["nome"] = validar_nome(alteracao.nome)
        if alteracao.arquivado is not None:
            habito["arquivado"] = alteracao.arquivado  # arquivar guarda o histórico
        salvar(dados)
    return habito


@app.delete("/api/habitos/{habito_id}", status_code=204)
def excluir_habito(habito_id: str):
    # A página já pediu confirmação antes de chamar esta rota.
    with TRAVA:
        dados = carregar()
        dados["habitos"].remove(buscar(dados, habito_id))
        salvar(dados)
    return Response(status_code=204)


@app.post("/api/habitos/{habito_id}/dias/{dia}")
def alternar_dia(habito_id: str, dia: str):
    """Marca o dia se estiver vazio; desmarca se já estiver marcado."""
    try:
        data = date.fromisoformat(dia)
    except ValueError:
        raise HTTPException(400, "Data inválida. Use o formato AAAA-MM-DD, por exemplo 2026-11-19.")
    if data > date.today():
        raise HTTPException(400, "Não dá para marcar um dia futuro. Escolha hoje ou um dia passado.")
    chave = data.isoformat()
    with TRAVA:
        dados = carregar()
        habito = buscar(dados, habito_id)
        if chave in habito["dias"]:
            habito["dias"].remove(chave)
        else:
            habito["dias"].append(chave)
            habito["dias"].sort()
        salvar(dados)
    return habito


# ---------- Página ----------

@app.get("/")
def pagina_inicial():
    return FileResponse(PASTA_STATIC / "index.html")


app.mount("/static", StaticFiles(directory=PASTA_STATIC), name="static")


if __name__ == "__main__":
    carregar()  # garante que data/habitos.json exista
    print("Monitor de hábitos rodando em http://127.0.0.1:8000  (Ctrl+C para parar)")
    uvicorn.run(app, host="127.0.0.1", port=8000)
`,
  "static/index.html@v1": `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Monitor de hábitos</title>
  <link rel="stylesheet" href="/static/style.css">
</head>
<body>
  <main>
    <h1>Monitor de hábitos</h1>

    <!-- Criar hábito: só o nome -->
    <form id="form-novo">
      <input id="nome-novo" type="text" maxlength="60"
             placeholder="Novo hábito, ex.: Beber água" aria-label="Nome do novo hábito">
      <button type="submit">Criar</button>
    </form>

    <!-- Navegação entre semanas -->
    <nav class="semanas">
      <button id="anterior" type="button">◀ Semana anterior</button>
      <button id="semana-atual" type="button">Hoje</button>
      <button id="proxima" type="button">Próxima semana ▶</button>
      <span id="periodo"></span>
    </nav>

    <p id="mensagem" role="status"></p>

    <table id="grade"></table>

    <details id="arquivados">
      <summary>Arquivados (<span id="qtd-arquivados">0</span>)</summary>
      <ul id="lista-arquivados"></ul>
    </details>
  </main>

  <script src="/static/app.js"></script>
</body>
</html>
`,
  "static/style.css@v1": `/* Aparência simples e legível; sem bibliotecas. */
:root {
  --fundo: #f6f7f9;
  --texto: #1f2328;
  --borda: #d0d7de;
  --feito: #2da44e;
  --hoje: #0969da;
  --perigo: #cf222e;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, "Segoe UI", sans-serif;
  background: var(--fundo);
  color: var(--texto);
}

main { max-width: 960px; margin: 0 auto; padding: 24px 16px; }

h1 { margin-top: 0; }

form, .semanas { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 12px; }

input[type="text"] { flex: 1; min-width: 200px; padding: 8px; font-size: 1rem; }

button {
  padding: 6px 12px;
  border: 1px solid var(--borda);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.95rem;
}
button:disabled { opacity: 0.4; cursor: not-allowed; }
button.perigo { color: var(--perigo); }

#periodo { font-weight: 600; }

#mensagem { min-height: 1.4em; margin: 4px 0 12px; }
#mensagem.erro { color: var(--perigo); }

table { width: 100%; border-collapse: collapse; background: #fff; }
th, td { border: 1px solid var(--borda); padding: 6px; text-align: center; }
td.nome { text-align: left; font-weight: 600; }
td.vazio { color: #57606a; padding: 16px; }
td.acoes { white-space: nowrap; }
td.acoes button { margin: 2px; padding: 4px 8px; font-size: 0.85rem; }

/* Célula de dia: um clique marca, outro desmarca */
button.dia { width: 40px; height: 40px; font-size: 1.2rem; }
button.dia.feito { background: var(--feito); border-color: var(--feito); color: #fff; }
button.dia.hoje { outline: 2px solid var(--hoje); outline-offset: 1px; }

details { margin-top: 20px; }
#lista-arquivados li { margin: 6px 0; }
#lista-arquivados button { margin-left: 8px; }
`,
  "static/app.js@v1": `/* Monitor de hábitos: a página conversa com a API local de main.py. */
"use strict";

const NOMES_DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

let habitos = [];          // lista vinda da API
let fimJanela = hoje();    // último dia mostrado na grade

// ---------- Datas (sempre no horário local) ----------

function hoje() {
  const agora = new Date();
  return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
}

function somarDias(data, n) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + n);
}

// Data -> "AAAA-MM-DD" (mesmo formato do arquivo)
function paraTexto(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return \`\${data.getFullYear()}-\${mes}-\${dia}\`;
}

function formatarCurto(data) {
  return String(data.getDate()).padStart(2, "0") + "/" + String(data.getMonth() + 1).padStart(2, "0");
}

// ---------- Comunicação com a API ----------

async function api(metodo, caminho, corpo) {
  let resposta;
  try {
    resposta = await fetch(caminho, {
      method: metodo,
      headers: corpo ? { "Content-Type": "application/json" } : {},
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch (erro) {
    throw new Error("Não consegui falar com o app. Confira se o cmd mostra o app rodando (uv run python main.py) e recarregue a página.");
  }
  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    // O servidor manda {"detail": "..."} já dizendo o que fazer.
    throw new Error(typeof dados.detail === "string"
      ? dados.detail
      : \`Algo deu errado (código \${resposta.status}). Recarregue a página e tente de novo.\`);
  }
  return dados;
}

function mostrarMensagem(texto, tipo) {
  const el = document.getElementById("mensagem");
  el.textContent = texto;
  el.className = tipo || "";
}

// Executa uma ação e mostra o erro na tela, se houver.
async function executar(acao) {
  try {
    await acao();
    mostrarMensagem("");
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
}

async function recarregar() {
  const dados = await api("GET", "/api/habitos");
  habitos = dados.habitos;
  desenhar();
}

function substituir(atualizado) {
  habitos = habitos.map((h) => (h.id === atualizado.id ? atualizado : h));
  desenhar();
}

// ---------- Cálculos (FR-004 e FR-005) ----------

// Dias seguidos até ontem; hoje marcado soma 1, hoje vazio não quebra.
function sequencia(habito) {
  const marcados = new Set(habito.dias);
  const dataHoje = hoje();
  let total = marcados.has(paraTexto(dataHoje)) ? 1 : 0;
  let dia = somarDias(dataHoje, -1);
  while (marcados.has(paraTexto(dia))) {
    total++;
    dia = somarDias(dia, -1);
  }
  return total;
}

// Dias marcados nos últimos 30 (contando hoje) ÷ 30.
function frequencia30(habito) {
  const marcados = new Set(habito.dias);
  let feitos = 0;
  for (let i = 0; i < 30; i++) {
    if (marcados.has(paraTexto(somarDias(hoje(), -i)))) feitos++;
  }
  return Math.round((feitos / 30) * 100);
}

// ---------- Desenho da tela ----------

function celula(linha, tag, texto) {
  const el = document.createElement(tag);
  el.textContent = texto; // textContent evita interpretar HTML no nome
  linha.appendChild(el);
  return el;
}

function botao(texto, aoClicar, classe) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = texto;
  if (classe) b.className = classe;
  b.addEventListener("click", aoClicar);
  return b;
}

function desenhar() {
  const dias = [];
  for (let i = 6; i >= 0; i--) dias.push(somarDias(fimJanela, -i));
  const textoHoje = paraTexto(hoje());

  document.getElementById("periodo").textContent = \`\${formatarCurto(dias[0])} a \${formatarCurto(dias[6])}\`;
  document.getElementById("proxima").disabled = paraTexto(fimJanela) >= textoHoje;

  const tabela = document.getElementById("grade");
  tabela.replaceChildren();

  const cabecalho = tabela.createTHead().insertRow();
  celula(cabecalho, "th", "Hábito");
  for (const d of dias) celula(cabecalho, "th", \`\${NOMES_DIAS[d.getDay()]} \${formatarCurto(d)}\`);
  celula(cabecalho, "th", "Sequência");
  celula(cabecalho, "th", "30 dias");
  celula(cabecalho, "th", "Ações");

  const corpo = tabela.createTBody();
  const ativos = habitos.filter((h) => !h.arquivado);

  if (ativos.length === 0) {
    const vazio = corpo.insertRow().insertCell();
    vazio.colSpan = 11;
    vazio.className = "vazio";
    vazio.textContent = "Nenhum hábito ainda. Digite um nome acima e clique em Criar.";
  }

  for (const h of ativos) {
    const linha = corpo.insertRow();
    celula(linha, "td", h.nome).className = "nome";
    const marcados = new Set(h.dias);

    for (const d of dias) {
      const texto = paraTexto(d);
      const feito = marcados.has(texto);
      const b = botao(feito ? "✓" : "", () => executar(() => alternarDia(h.id, texto)),
        "dia" + (feito ? " feito" : "") + (texto === textoHoje ? " hoje" : ""));
      b.title = (feito ? "Desmarcar " : "Marcar ") + formatarCurto(d);
      b.setAttribute("aria-pressed", String(feito));
      b.disabled = texto > textoHoje; // dias futuros não podem ser marcados (FR-007)
      linha.insertCell().appendChild(b);
    }

    const seq = sequencia(h);
    celula(linha, "td", seq === 1 ? "1 dia" : \`\${seq} dias\`);
    celula(linha, "td", \`\${frequencia30(h)}%\`);

    const acoes = linha.insertCell();
    acoes.className = "acoes";
    acoes.append(
      botao("Renomear", () => renomear(h)),
      botao("Arquivar", () => definirArquivado(h, true)),
      botao("Excluir", () => excluir(h), "perigo"),
    );
  }

  desenharArquivados();
}

function desenharArquivados() {
  const arquivados = habitos.filter((h) => h.arquivado);
  document.getElementById("qtd-arquivados").textContent = arquivados.length;
  const lista = document.getElementById("lista-arquivados");
  lista.replaceChildren();
  for (const h of arquivados) {
    const item = document.createElement("li");
    item.textContent = h.nome;
    item.append(
      botao("Desarquivar", () => definirArquivado(h, false)),
      botao("Excluir", () => excluir(h), "perigo"),
    );
    lista.appendChild(item);
  }
}

// ---------- Ações ----------

async function alternarDia(id, data) {
  substituir(await api("POST", \`/api/habitos/\${encodeURIComponent(id)}/dias/\${data}\`));
}

async function criar(evento) {
  evento.preventDefault();
  const campo = document.getElementById("nome-novo");
  const nome = campo.value.trim();
  if (!nome) {
    mostrarMensagem("Digite um nome para o hábito.", "erro");
    return;
  }
  await executar(async () => {
    habitos.push(await api("POST", "/api/habitos", { nome }));
    campo.value = "";
    desenhar();
  });
  campo.focus();
}

function renomear(h) {
  const nome = prompt(\`Novo nome para "\${h.nome}":\`, h.nome);
  if (nome === null) return; // cancelou
  executar(async () => substituir(await api("PATCH", \`/api/habitos/\${encodeURIComponent(h.id)}\`, { nome })));
}

function definirArquivado(h, arquivado) {
  executar(async () => substituir(await api("PATCH", \`/api/habitos/\${encodeURIComponent(h.id)}\`, { arquivado })));
}

function excluir(h) {
  // FR-012: nada é apagado sem confirmação.
  if (!confirm(\`Excluir "\${h.nome}" e todo o histórico? Isso não pode ser desfeito.\`)) return;
  executar(async () => {
    await api("DELETE", \`/api/habitos/\${encodeURIComponent(h.id)}\`);
    habitos = habitos.filter((x) => x.id !== h.id);
    desenhar();
  });
}

// ---------- Navegação entre semanas (FR-006) ----------

document.getElementById("anterior").addEventListener("click", () => {
  fimJanela = somarDias(fimJanela, -7);
  desenhar();
});

document.getElementById("proxima").addEventListener("click", () => {
  const proxima = somarDias(fimJanela, 7);
  fimJanela = proxima > hoje() ? hoje() : proxima; // nunca passa de hoje
  desenhar();
});

document.getElementById("semana-atual").addEventListener("click", () => {
  fimJanela = hoje();
  desenhar();
});

document.getElementById("form-novo").addEventListener("submit", criar);

executar(recarregar);
`,
  "README.md@v1": `# Monitor de hábitos

Monitor de hábitos pessoal, local e offline. Seus dados ficam em \`data/habitos.json\`,
dentro desta pasta, e nunca saem do computador.

## Como rodar

No cmd, dentro da pasta \`sdd-workshop\`:

\`\`\`bat
uv run python main.py
\`\`\`

Abra http://127.0.0.1:8000 no navegador. Para parar: Ctrl+C no cmd.

Na primeira vez, o uv instala as dependências (FastAPI e Uvicorn) sozinho.

## Como usar

1. Digite o nome de um hábito e clique em **Criar**.
2. Clique numa célula para marcar o dia; clique de novo para desmarcar.
3. Use **Semana anterior** para corrigir dias passados (dias futuros ficam bloqueados).
4. **Arquivar** esconde o hábito e guarda o histórico; **Excluir** apaga tudo, depois de confirmar.

## Problemas comuns

| Mensagem | O que fazer |
|----------|-------------|
| "address already in use" | O app já está rodando em outro cmd: pare com Ctrl+C lá. |
| "Não consegui falar com o app" | Confira se o cmd mostra o app rodando e recarregue a página. |
| "erro de formato" no arquivo | Corrija \`data/habitos.json\` num editor de texto ou restaure uma cópia. |

Documentação da funcionalidade: \`specs/001-monitor-habitos/\`.
`,
  "specs/002-metas-semanais/spec.md@v1": `# Feature Specification: Metas semanais

**Feature Branch**: \`002-metas-semanais\`
**Created**: 2026-11-19
**Status**: Draft
**Input**: User description: "Nova funcionalidade para o monitor de hábitos existente: metas semanais..."

## Clarifications

### Session 2026-11-19

- Q: Quando começa a semana? → A: Segunda a domingo (semana de calendário).
- Q: A semana atual, ainda sem a meta cumprida, quebra a sequência? → A: Não. Igual à regra diária: a semana em andamento só soma se a meta já foi cumprida.
- Decisão assumida (opção mais simples): mudar a meta não apaga nem altera dias já marcados.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Meta semanal na grade (Priority: P1)

A pessoa define que um hábito tem meta de 1 a 7 vezes por semana. Na grade, esse
hábito mostra o progresso da semana, por exemplo "2 de 3".

**Why this priority**: é o pedido central; hábitos como "academia" não são diários.

**Independent Test**: definir meta 3 para "Caminhar", marcar 2 dias da semana e ver "2 de 3".

**Acceptance Scenarios**:

1. **Given** um hábito diário, **When** defino meta 3, **Then** a grade mostra "0 de 3".
2. **Given** meta 3 e 2 dias marcados na semana, **When** marco o 3º, **Then** vejo "3 de 3".
3. **Given** um hábito semanal, **When** apago a meta, **Then** ele volta a ser diário.

---

### User Story 2 - Sequência em semanas (Priority: P2)

Para hábitos semanais, a sequência conta semanas seguidas com a meta cumprida.

**Why this priority**: mantém a motivação coerente com a meta.

**Independent Test**: cumprir a meta nas 2 semanas anteriores e ver "2 semanas".

**Acceptance Scenarios**:

1. **Given** meta cumprida nas 2 semanas anteriores e semana atual incompleta, **When** abro o app, **Then** vejo "2 semanas".

### Edge Cases

- Meta fora de 1 a 7: o app recusa e diz o que fazer.
- Hábitos antigos, sem meta: continuam diários.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-101**: Cada hábito DEVE ser diário (padrão) ou ter meta de 1 a 7 vezes por semana.
- **FR-102**: A pessoa DEVE conseguir definir, mudar ou remover a meta de um hábito.
- **FR-103**: Para hábito semanal, a grade DEVE mostrar o progresso da semana ("X de Y").
- **FR-104**: Para hábito semanal, a sequência DEVE contar semanas seguidas com meta cumprida.
- **FR-105**: Hábitos existentes DEVEM continuar funcionando como diários.

## Success Criteria *(mandatory)*

- **SC-101**: Definir uma meta semanal leva menos de 30 segundos.
- **SC-102**: Nenhum dado marcado antes da mudança é perdido.

## Out of Scope

Lembretes, metas mensais, notificações.
`,
  "specs/002-metas-semanais/plan.md@v1": `# Implementation Plan: Metas semanais

**Branch**: \`002-metas-semanais\` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)

## Summary

Adicionar o campo opcional \`meta\` ao hábito. A API aceita e valida a meta; a página
mostra o progresso da semana e calcula a sequência em semanas.

## Technical Context

Sem mudanças: Python 3.12 + FastAPI/Uvicorn, HTML/CSS/JS puros, \`data/habitos.json\`.
Nenhuma dependência nova.

## Constitution Check

| Princípio | Status |
|-----------|--------|
| I. Simplicidade — 1 campo novo, nenhum arquivo novo | ✅ |
| II. Local e offline — sem mudança | ✅ |
| III. Dados — arquivos antigos continuam válidos (sem \`meta\` = diário) | ✅ |
| IV. Para iniciantes — mensagens em pt-BR | ✅ |
| V. Fácil de rodar — mesmo comando | ✅ |

## Mudanças

- **data-model**: \`meta\`: \`null\` (diário) ou inteiro de 1 a 7. Ausente = \`null\`.
- **contracts/api.md**: \`POST\` e \`PATCH /api/habitos\` aceitam \`"meta"\`; fora de 1–7 → \`400\`.
- **main.py**: validar e gravar \`meta\`; \`PATCH\` com \`"meta": null\` volta a diário.
- **static/app.js**: coluna "Semana" com "X de Y"; sequência em semanas; botão "Meta".

## Complexity Tracking

Nenhuma violação.
`,
  "specs/002-metas-semanais/tasks.md@v1": `---
description: "Lista de tarefas das metas semanais"
---

# Tasks: Metas semanais

**Input**: Design documents from \`/specs/002-metas-semanais/\`
**Tests**: sem testes automatizados (Princípio V).

## Phase 1: Foundational

- [X] T101 Em \`main.py\`: campo \`meta\` (null ou 1–7) em criar e alterar, com mensagem em pt-BR — FR-101, FR-102, FR-105
  - Conferir: \`data/habitos.json\` mostra \`"meta": 3\` depois de definir a meta.

## Phase 2: User Story 1 - Meta semanal na grade (Priority: P1) 🎯 MVP

- [X] T102 [US1] Em \`static/app.js\`: botão "Meta" e coluna "Semana" com "X de Y" — FR-102, FR-103
  - Conferir: meta 3 e 2 dias marcados na semana → "2 de 3".

## Phase 3: User Story 2 - Sequência em semanas (Priority: P2)

- [X] T103 [US2] Em \`static/app.js\`: sequência em semanas seguidas com meta cumprida — FR-104
  - Conferir: meta cumprida nas 2 semanas anteriores → "2 semanas".

## Phase 4: Polish

- [X] T104 Atualizar data-model.md e contracts/api.md da 001 com o campo \`meta\`
  - Conferir: os documentos citam \`meta\` e a regra 1–7.
`,
  "main.py@metas": `"""Monitor de hábitos: servidor local que entrega a página e uma pequena API JSON.

Rodar:  uv run python main.py   ->   abrir http://127.0.0.1:8000
"""

import json
import os
import tempfile
import threading
import uuid
from datetime import date
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Caminhos a partir da pasta do projeto (funciona de qualquer cmd).
PASTA = Path(__file__).resolve().parent
ARQUIVO_DADOS = PASTA / "data" / "habitos.json"
PASTA_STATIC = PASTA / "static"
TAMANHO_MAX_NOME = 60

# Evita que duas gravações simultâneas sobrescrevam uma à outra.
TRAVA = threading.Lock()

app = FastAPI(title="Monitor de hábitos")


# ---------- Leitura e gravação do arquivo ----------

def salvar(dados: dict) -> None:
    """Grava num arquivo temporário e só depois troca pelo original (não corrompe)."""
    ARQUIVO_DADOS.parent.mkdir(exist_ok=True)
    descritor, caminho_tmp = tempfile.mkstemp(dir=ARQUIVO_DADOS.parent, suffix=".tmp")
    try:
        with os.fdopen(descritor, "w", encoding="utf-8") as arquivo:
            json.dump(dados, arquivo, ensure_ascii=False, indent=2)
            arquivo.flush()
            os.fsync(arquivo.fileno())
        os.replace(caminho_tmp, ARQUIVO_DADOS)  # troca atômica
    except BaseException:
        # Deu errado: apaga o temporário; o arquivo antigo continua intacto.
        if os.path.exists(caminho_tmp):
            os.remove(caminho_tmp)
        raise


def carregar() -> dict:
    """Lê os dados; se o arquivo ainda não existe, cria um vazio."""
    if not ARQUIVO_DADOS.exists():
        salvar({"versao": 1, "habitos": []})
    try:
        with open(ARQUIVO_DADOS, encoding="utf-8") as arquivo:
            dados = json.load(arquivo)
    except json.JSONDecodeError:
        raise HTTPException(
            500,
            "O arquivo data/habitos.json está com erro de formato. "
            "Corrija o trecho quebrado (ou restaure uma cópia) e recarregue a página.",
        )
    # Hábitos antigos, sem meta, continuam diários (FR-105).
    for habito in dados["habitos"]:
        habito.setdefault("meta", None)
    return dados


def validar_nome(nome: str) -> str:
    """Tira espaços das pontas e confere o tamanho do nome."""
    nome = nome.strip()
    if not nome:
        raise HTTPException(400, "Digite um nome para o hábito.")
    if len(nome) > TAMANHO_MAX_NOME:
        raise HTTPException(400, f"Use um nome com até {TAMANHO_MAX_NOME} caracteres.")
    return nome


def validar_meta(meta: int | None) -> int | None:
    """None = hábito diário; 1 a 7 = vezes por semana."""
    if meta is None:
        return None
    if not 1 <= meta <= 7:
        raise HTTPException(400, "A meta semanal deve ser de 1 a 7 vezes. Deixe vazio para hábito diário.")
    return meta


def buscar(dados: dict, habito_id: str) -> dict:
    """Encontra o hábito pelo id ou responde 404."""
    for habito in dados["habitos"]:
        if habito["id"] == habito_id:
            return habito
    raise HTTPException(404, "Hábito não encontrado. Recarregue a página.")


# ---------- Formatos aceitos pela API ----------

class NovoHabito(BaseModel):
    nome: str
    meta: int | None = None


class AlteracaoHabito(BaseModel):
    nome: str | None = None
    arquivado: bool | None = None
    meta: int | None = None


# ---------- API (contracts/api.md) ----------

@app.get("/api/habitos")
def listar_habitos():
    with TRAVA:
        return carregar()


@app.post("/api/habitos", status_code=201)
def criar_habito(novo: NovoHabito):
    nome = validar_nome(novo.nome)
    meta = validar_meta(novo.meta)
    with TRAVA:
        dados = carregar()
        habito = {
            "id": uuid.uuid4().hex[:8],
            "nome": nome,
            "arquivado": False,
            "criado_em": date.today().isoformat(),
            "meta": meta,
            "dias": [],
        }
        dados["habitos"].append(habito)
        salvar(dados)
    return habito


@app.patch("/api/habitos/{habito_id}")
def alterar_habito(habito_id: str, alteracao: AlteracaoHabito):
    with TRAVA:
        dados = carregar()
        habito = buscar(dados, habito_id)
        if alteracao.nome is not None:
            habito["nome"] = validar_nome(alteracao.nome)
        if alteracao.arquivado is not None:
            habito["arquivado"] = alteracao.arquivado  # arquivar guarda o histórico
        # "meta": null no corpo significa voltar a ser diário; campo ausente não muda nada.
        if "meta" in alteracao.model_fields_set:
            habito["meta"] = validar_meta(alteracao.meta)
        salvar(dados)
    return habito


@app.delete("/api/habitos/{habito_id}", status_code=204)
def excluir_habito(habito_id: str):
    # A página já pediu confirmação antes de chamar esta rota.
    with TRAVA:
        dados = carregar()
        dados["habitos"].remove(buscar(dados, habito_id))
        salvar(dados)
    return Response(status_code=204)


@app.post("/api/habitos/{habito_id}/dias/{dia}")
def alternar_dia(habito_id: str, dia: str):
    """Marca o dia se estiver vazio; desmarca se já estiver marcado."""
    try:
        data = date.fromisoformat(dia)
    except ValueError:
        raise HTTPException(400, "Data inválida. Use o formato AAAA-MM-DD, por exemplo 2026-11-19.")
    if data > date.today():
        raise HTTPException(400, "Não dá para marcar um dia futuro. Escolha hoje ou um dia passado.")
    chave = data.isoformat()
    with TRAVA:
        dados = carregar()
        habito = buscar(dados, habito_id)
        if chave in habito["dias"]:
            habito["dias"].remove(chave)
        else:
            habito["dias"].append(chave)
            habito["dias"].sort()
        salvar(dados)
    return habito


# ---------- Página ----------

@app.get("/")
def pagina_inicial():
    return FileResponse(PASTA_STATIC / "index.html")


app.mount("/static", StaticFiles(directory=PASTA_STATIC), name="static")


if __name__ == "__main__":
    carregar()  # garante que data/habitos.json exista
    print("Monitor de hábitos rodando em http://127.0.0.1:8000  (Ctrl+C para parar)")
    uvicorn.run(app, host="127.0.0.1", port=8000)
`,
  "static/app.js@metas": `/* Monitor de hábitos: a página conversa com a API local de main.py. */
"use strict";

const NOMES_DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

let habitos = [];          // lista vinda da API
let fimJanela = hoje();    // último dia mostrado na grade

// ---------- Datas (sempre no horário local) ----------

function hoje() {
  const agora = new Date();
  return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
}

function somarDias(data, n) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + n);
}

// Segunda-feira da semana (seg a dom) que contém a data.
function segundaDaSemana(data) {
  const diasDesdeSegunda = (data.getDay() + 6) % 7;
  return somarDias(data, -diasDesdeSegunda);
}

// Data -> "AAAA-MM-DD" (mesmo formato do arquivo)
function paraTexto(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return \`\${data.getFullYear()}-\${mes}-\${dia}\`;
}

function formatarCurto(data) {
  return String(data.getDate()).padStart(2, "0") + "/" + String(data.getMonth() + 1).padStart(2, "0");
}

// ---------- Comunicação com a API ----------

async function api(metodo, caminho, corpo) {
  let resposta;
  try {
    resposta = await fetch(caminho, {
      method: metodo,
      headers: corpo ? { "Content-Type": "application/json" } : {},
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch (erro) {
    throw new Error("Não consegui falar com o app. Confira se o cmd mostra o app rodando (uv run python main.py) e recarregue a página.");
  }
  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    // O servidor manda {"detail": "..."} já dizendo o que fazer.
    throw new Error(typeof dados.detail === "string"
      ? dados.detail
      : \`Algo deu errado (código \${resposta.status}). Recarregue a página e tente de novo.\`);
  }
  return dados;
}

function mostrarMensagem(texto, tipo) {
  const el = document.getElementById("mensagem");
  el.textContent = texto;
  el.className = tipo || "";
}

// Executa uma ação e mostra o erro na tela, se houver.
async function executar(acao) {
  try {
    await acao();
    mostrarMensagem("");
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
}

async function recarregar() {
  const dados = await api("GET", "/api/habitos");
  habitos = dados.habitos;
  desenhar();
}

function substituir(atualizado) {
  habitos = habitos.map((h) => (h.id === atualizado.id ? atualizado : h));
  desenhar();
}

// ---------- Cálculos ----------

// Hábito diário: dias seguidos até ontem; hoje marcado soma 1, hoje vazio não quebra.
function sequenciaDiaria(habito) {
  const marcados = new Set(habito.dias);
  const dataHoje = hoje();
  let total = marcados.has(paraTexto(dataHoje)) ? 1 : 0;
  let dia = somarDias(dataHoje, -1);
  while (marcados.has(paraTexto(dia))) {
    total++;
    dia = somarDias(dia, -1);
  }
  return total;
}

// Quantos dias marcados na semana (seg a dom) que começa na segunda informada.
function feitosNaSemana(habito, segunda) {
  const marcados = new Set(habito.dias);
  let feitos = 0;
  for (let i = 0; i < 7; i++) {
    if (marcados.has(paraTexto(somarDias(segunda, i)))) feitos++;
  }
  return feitos;
}

// Hábito semanal: semanas seguidas com a meta cumprida até a semana passada;
// a semana atual só soma se a meta já foi cumprida (não quebra a sequência).
function sequenciaSemanal(habito) {
  const segundaAtual = segundaDaSemana(hoje());
  let total = feitosNaSemana(habito, segundaAtual) >= habito.meta ? 1 : 0;
  let segunda = somarDias(segundaAtual, -7);
  while (feitosNaSemana(habito, segunda) >= habito.meta) {
    total++;
    segunda = somarDias(segunda, -7);
  }
  return total;
}

function textoSequencia(habito) {
  if (habito.meta) {
    const n = sequenciaSemanal(habito);
    return n === 1 ? "1 semana" : \`\${n} semanas\`;
  }
  const n = sequenciaDiaria(habito);
  return n === 1 ? "1 dia" : \`\${n} dias\`;
}

// Dias marcados nos últimos 30 (contando hoje) ÷ 30.
function frequencia30(habito) {
  const marcados = new Set(habito.dias);
  let feitos = 0;
  for (let i = 0; i < 30; i++) {
    if (marcados.has(paraTexto(somarDias(hoje(), -i)))) feitos++;
  }
  return Math.round((feitos / 30) * 100);
}

// ---------- Desenho da tela ----------

function celula(linha, tag, texto) {
  const el = document.createElement(tag);
  el.textContent = texto; // textContent evita interpretar HTML no nome
  linha.appendChild(el);
  return el;
}

function botao(texto, aoClicar, classe) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = texto;
  if (classe) b.className = classe;
  b.addEventListener("click", aoClicar);
  return b;
}

function desenhar() {
  const dias = [];
  for (let i = 6; i >= 0; i--) dias.push(somarDias(fimJanela, -i));
  const textoHoje = paraTexto(hoje());
  // Progresso semanal: semana (seg a dom) que contém o último dia mostrado.
  const segundaMostrada = segundaDaSemana(fimJanela);

  document.getElementById("periodo").textContent = \`\${formatarCurto(dias[0])} a \${formatarCurto(dias[6])}\`;
  document.getElementById("proxima").disabled = paraTexto(fimJanela) >= textoHoje;

  const tabela = document.getElementById("grade");
  tabela.replaceChildren();

  const cabecalho = tabela.createTHead().insertRow();
  celula(cabecalho, "th", "Hábito");
  for (const d of dias) celula(cabecalho, "th", \`\${NOMES_DIAS[d.getDay()]} \${formatarCurto(d)}\`);
  celula(cabecalho, "th", "Semana");
  celula(cabecalho, "th", "Sequência");
  celula(cabecalho, "th", "30 dias");
  celula(cabecalho, "th", "Ações");

  const corpo = tabela.createTBody();
  const ativos = habitos.filter((h) => !h.arquivado);

  if (ativos.length === 0) {
    const vazio = corpo.insertRow().insertCell();
    vazio.colSpan = 12;
    vazio.className = "vazio";
    vazio.textContent = "Nenhum hábito ainda. Digite um nome acima e clique em Criar.";
  }

  for (const h of ativos) {
    const linha = corpo.insertRow();
    celula(linha, "td", h.nome).className = "nome";
    const marcados = new Set(h.dias);

    for (const d of dias) {
      const texto = paraTexto(d);
      const feito = marcados.has(texto);
      const b = botao(feito ? "✓" : "", () => executar(() => alternarDia(h.id, texto)),
        "dia" + (feito ? " feito" : "") + (texto === textoHoje ? " hoje" : ""));
      b.title = (feito ? "Desmarcar " : "Marcar ") + formatarCurto(d);
      b.setAttribute("aria-pressed", String(feito));
      b.disabled = texto > textoHoje; // dias futuros não podem ser marcados
      linha.insertCell().appendChild(b);
    }

    // Coluna "Semana": "2 de 3" para hábito semanal; "diário" para os demais.
    celula(linha, "td", h.meta ? \`\${feitosNaSemana(h, segundaMostrada)} de \${h.meta}\` : "diário");
    celula(linha, "td", textoSequencia(h));
    celula(linha, "td", \`\${frequencia30(h)}%\`);

    const acoes = linha.insertCell();
    acoes.className = "acoes";
    acoes.append(
      botao("Meta", () => definirMeta(h)),
      botao("Renomear", () => renomear(h)),
      botao("Arquivar", () => definirArquivado(h, true)),
      botao("Excluir", () => excluir(h), "perigo"),
    );
  }

  desenharArquivados();
}

function desenharArquivados() {
  const arquivados = habitos.filter((h) => h.arquivado);
  document.getElementById("qtd-arquivados").textContent = arquivados.length;
  const lista = document.getElementById("lista-arquivados");
  lista.replaceChildren();
  for (const h of arquivados) {
    const item = document.createElement("li");
    item.textContent = h.nome;
    item.append(
      botao("Desarquivar", () => definirArquivado(h, false)),
      botao("Excluir", () => excluir(h), "perigo"),
    );
    lista.appendChild(item);
  }
}

// ---------- Ações ----------

async function alternarDia(id, data) {
  substituir(await api("POST", \`/api/habitos/\${encodeURIComponent(id)}/dias/\${data}\`));
}

async function criar(evento) {
  evento.preventDefault();
  const campo = document.getElementById("nome-novo");
  const nome = campo.value.trim();
  if (!nome) {
    mostrarMensagem("Digite um nome para o hábito.", "erro");
    return;
  }
  await executar(async () => {
    habitos.push(await api("POST", "/api/habitos", { nome })); // nasce diário (padrão)
    campo.value = "";
    desenhar();
  });
  campo.focus();
}

function definirMeta(h) {
  const resposta = prompt(
    \`Quantas vezes por semana para "\${h.nome}"? (1 a 7)\\nDeixe vazio para hábito diário.\`,
    h.meta ? String(h.meta) : "",
  );
  if (resposta === null) return; // cancelou
  const texto = resposta.trim();
  const meta = texto === "" ? null : Number(texto);
  if (meta !== null && !(Number.isInteger(meta) && meta >= 1 && meta <= 7)) {
    mostrarMensagem("A meta semanal deve ser um número de 1 a 7. Deixe vazio para hábito diário.", "erro");
    return;
  }
  executar(async () => substituir(await api("PATCH", \`/api/habitos/\${encodeURIComponent(h.id)}\`, { meta })));
}

function renomear(h) {
  const nome = prompt(\`Novo nome para "\${h.nome}":\`, h.nome);
  if (nome === null) return; // cancelou
  executar(async () => substituir(await api("PATCH", \`/api/habitos/\${encodeURIComponent(h.id)}\`, { nome })));
}

function definirArquivado(h, arquivado) {
  executar(async () => substituir(await api("PATCH", \`/api/habitos/\${encodeURIComponent(h.id)}\`, { arquivado })));
}

function excluir(h) {
  // Nada é apagado sem confirmação.
  if (!confirm(\`Excluir "\${h.nome}" e todo o histórico? Isso não pode ser desfeito.\`)) return;
  executar(async () => {
    await api("DELETE", \`/api/habitos/\${encodeURIComponent(h.id)}\`);
    habitos = habitos.filter((x) => x.id !== h.id);
    desenhar();
  });
}

// ---------- Navegação entre semanas ----------

document.getElementById("anterior").addEventListener("click", () => {
  fimJanela = somarDias(fimJanela, -7);
  desenhar();
});

document.getElementById("proxima").addEventListener("click", () => {
  const proxima = somarDias(fimJanela, 7);
  fimJanela = proxima > hoje() ? hoje() : proxima; // nunca passa de hoje
  desenhar();
});

document.getElementById("semana-atual").addEventListener("click", () => {
  fimJanela = hoje();
  desenhar();
});

document.getElementById("form-novo").addEventListener("submit", criar);

executar(recarregar);
`,
};
