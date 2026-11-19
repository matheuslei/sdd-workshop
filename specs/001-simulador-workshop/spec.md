# Feature Specification: Simulador do Workshop SDD

**Feature Branch**: `001-simulador-workshop`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "Simulador do Workshop SDD no navegador, para quem não conseguiu configurar o ambiente a tempo acompanhar o workshop inteiro num ambiente simulado: instalação guiada (trilha OpenCode+OpenRouter ou Claude Code), prompts /speckit.* gerando os artefatos e o Monitor de hábitos final funcionando."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instalar o ambiente na simulação (Priority: P1)

Uma pessoa sem experiência (ou sem tempo de instalar) abre o simulador, escolhe a trilha
**OpenCode + OpenRouter** ou **Claude Code** e percorre as etapas de instalação do workshop.
Cada etapa diz em qual terminal rodar (⬛ cmd ou 🟦 PowerShell), mostra o comando com botão
Copiar e um terminal simulado. Ela cola o comando, vê a saída ilustrativa e avança.

Etapas comuns: uv → Python 3.12 → Spec Kit → (trilha) → reiniciar → verificações →
criar o projeto (`specify init ... --integration <trilha> --script ps`, `cd sdd-workshop`,
`uv init --python 3.12`).
- Trilha OpenCode: Node.js portátil (bloco PowerShell), prefixo do npm, instalar OpenCode,
  verificar versões, abrir o OpenCode, `/connect` → OpenRouter → chave **falsa** → `/models`
  → Nemotron 3.5 Super VL (free) → teste "Responda apenas: ok".
- Trilha Claude Code: instalar o Claude Code, conferir versão, entrar na conta (login
  simulado, sem credenciais), teste "Responda apenas: ok".

**Why this priority**: é a dor que motivou o projeto: muita gente travou na instalação.

**Independent Test**: abrir o simulador, escolher uma trilha e concluir todas as etapas só
colando os comandos exibidos; ao final aparece "Ambiente pronto".

**Acceptance Scenarios**:

1. **Given** a etapa "Instalar o uv" ativa no cmd, **When** o aluno cola o comando exato,
   **Then** aparece a saída ilustrativa e a próxima etapa é liberada.
2. **Given** uma etapa de cmd, **When** o aluno cola um comando de PowerShell (ou com erro de
   digitação), **Then** a etapa não avança e aparece uma dica específica.
3. **Given** a etapa `/connect`, **When** o aluno cola algo com formato de chave real,
   **Then** surge um alerta de segurança, o texto é descartado e a chave falsa é sugerida.
4. **Given** a trilha Claude escolhida, **When** o aluno troca para OpenCode, **Then** as
   etapas comuns concluídas continuam concluídas e as da nova trilha aparecem pendentes.

---

### User Story 2 - Construir o projeto com /speckit.* (Priority: P1)

Depois da instalação (ou direto, se preferir), o aluno abre o simulador do projeto: um
agente simulado (OpenCode ou Claude Code, conforme a trilha) com uma árvore de arquivos ao
lado. Ele executa o Passo 0 e cola, em ordem, os prompts de constitution, specify, clarify
(respondendo com as respostas combinadas da turma), plan, tasks, analyze (opcional) e
implement. Cada prompt gera uma resposta animada do agente e cria/atualiza arquivos na
árvore, que podem ser abertos para leitura.

**Why this priority**: é o coração do workshop: entender o fluxo SDD vendo os artefatos.

**Independent Test**: abrir direto o simulador do projeto, colar os prompts na ordem e ver
`constitution.md`, `spec.md`, `plan.md`, `tasks.md` e o código surgirem e poderem ser lidos.

**Acceptance Scenarios**:

1. **Given** a etapa Constitution, **When** o aluno cola o prompt da etapa, **Then** o agente
   responde e `.specify/memory/constitution.md` aparece destacado na árvore.
2. **Given** a etapa Clarify, **When** o agente faz a pergunta sobre sequência, **Then** o
   aluno pode responder com a resposta combinada (botão de atalho) e a spec é atualizada.
3. **Given** que o aluno cola o prompt de uma etapa futura, **Then** o agente explica que é
   preciso seguir a ordem e indica a etapa atual.
4. **Given** a implementação concluída, **When** o aluno roda `uv run python main.py`,
   **Then** aparece a saída do servidor e um botão para abrir http://127.0.0.1:8000.

---

### User Story 3 - Usar o Monitor de hábitos pronto (Priority: P1)

O aluno abre o resultado num navegador simulado (barra de endereço 127.0.0.1:8000) e usa o
Monitor de hábitos: cria hábitos, marca e desmarca dias, vê sequência e frequência,
navega por semanas, renomeia, arquiva e exclui (com confirmação).

**Why this priority**: fecha o ciclo e mostra que a spec virou um produto funcionando.

**Independent Test**: abrir a página do app, criar "Beber água", marcar hoje, recarregar a
página e ver a marcação mantida.

**Acceptance Scenarios**:

1. **Given** a grade vazia, **When** o aluno cria um hábito só com o nome, **Then** ele
   aparece com os últimos 7 dias.
2. **Given** um hábito, **When** o aluno clica num dia, **Then** marca; outro clique desmarca.
3. **Given** dias futuros na semana exibida, **Then** eles não podem ser marcados.
4. **Given** marcações até ontem em dias seguidos, **Then** a sequência conta esses dias,
   mesmo que hoje ainda esteja sem marcação.
5. **Given** o pedido de excluir, **Then** é exigida confirmação; arquivar esconde e mantém
   o histórico, podendo restaurar.

---

### User Story 4 - Consultar o guia e os prompts (Priority: P2)

O aluno consulta uma página com o guia de instalação da trilha escolhida (para fazer na
máquina real depois) e uma página com todos os prompts da prática com botão Copiar.

**Why this priority**: permite ao aluno repetir tudo de verdade em casa.

**Independent Test**: abrir a página de prompts, copiar um prompt e colá-lo num editor.

**Acceptance Scenarios**:

1. **Given** a página de prompts, **When** o aluno clica em Copiar, **Then** o texto exato do
   prompt vai para a área de transferência e aparece "Copiado!".

---

### User Story 5 - Ver problemas comuns (Priority: P2)

Durante a simulação, o aluno pode disparar os problemas comuns do workshop ("'uv' não é
reconhecido", erro de certificado SSL, erro 429, "address already in use") e ver a causa e
como resolver.

**Why this priority**: prepara para o que acontece na máquina real.

**Independent Test**: no terminal simulado, acionar um problema comum e seguir a correção.

**Acceptance Scenarios**:

1. **Given** um problema comum exibido, **When** o aluno aplica o comando de correção,
   **Then** o terminal mostra o sucesso.

---

### User Story 6 - Modo assistir, bônus e reinício (Priority: P3)

O aluno pode deixar o simulador executar as etapas sozinho (modo Assistir), fazer o bônus
de metas semanais na simulação e reiniciar todo o progresso.

**Why this priority**: conveniência; útil para quem só quer acompanhar o instrutor.

**Independent Test**: ativar o modo Assistir e ver a trilha concluir sem digitar nada.

**Acceptance Scenarios**:

1. **Given** o modo Assistir, **Then** cada comando é "digitado" e executado com pausa.
2. **Given** o botão Reiniciar progresso, **When** confirmado, **Then** tudo volta ao início.

---

### Edge Cases

- Comando com espaços extras, aspas diferentes ou maiúsculas/minúsculas trocadas: aceito
  quando o significado é o mesmo; caso contrário, dica.
- Prompt colado sem o prefixo `/speckit.` ou com texto alterado: aceito se o prefixo da etapa
  estiver certo (o aluno pode personalizar o texto), com aviso.
- Bloco PowerShell do Node colado pela metade: dica "copie o bloco inteiro".
- Navegador sem permissão de área de transferência: o botão Copiar seleciona o texto e
  orienta Ctrl+C.
- Armazenamento do navegador indisponível (aba privada): tudo funciona, só sem salvar.
- Chave com formato real colada em qualquer terminal: alerta e descarte.
- Aluno abre o app final sem ter feito a simulação: funciona mesmo assim, com aviso.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O simulador MUST permitir escolher a trilha (OpenCode + OpenRouter ou Claude
  Code) na página inicial e trocá-la depois; a escolha fica salva.
- **FR-002**: O simulador de instalação MUST apresentar as etapas na ordem do guia do
  workshop, indicando o terminal de cada uma (⬛ cmd ou 🟦 PowerShell).
- **FR-003**: Cada etapa MUST mostrar o comando com botão Copiar e só avançar quando o
  comando colado corresponder ao esperado.
- **FR-004**: Comandos incorretos MUST gerar dica específica (terminal errado, bloco
  incompleto, digitação) sem avançar.
- **FR-005**: Toda saída simulada MUST exibir o selo "saída ilustrativa".
- **FR-006**: O simulador MUST NOT aceitar nem guardar credenciais reais; texto com formato
  de chave real MUST disparar alerta e ser descartado.
- **FR-007**: Cada etapa MUST oferecer "Mostrar resposta" e "Pular" para ninguém travar.
- **FR-008**: O simulador do projeto MUST conduzir o Passo 0 e os prompts de constitution,
  specify, clarify, plan, tasks, analyze (opcional) e implement, com os textos idênticos ao
  material da prática.
- **FR-009**: Cada prompt aceito MUST produzir resposta do agente e criar/atualizar arquivos
  numa árvore lateral, com conteúdo legível ao clicar.
- **FR-010**: A etapa Clarify MUST apresentar as duas perguntas e aceitar as respostas
  combinadas da turma (atalho de um clique ou texto livre).
- **FR-011**: Após a implementação, rodar o app MUST mostrar a saída do servidor e abrir o
  Monitor de hábitos num navegador simulado com o endereço 127.0.0.1:8000.
- **FR-012**: O Monitor de hábitos MUST oferecer: criar hábito só com nome; grade hábitos ×
  7 dias; marcar/desmarcar com um clique; sequência atual (conta até ontem; hoje sem marca
  não quebra); frequência dos últimos 30 dias em %; navegar para semanas anteriores; dias
  futuros bloqueados; renomear; arquivar/restaurar; excluir com confirmação.
- **FR-013**: Os dados do Monitor e o progresso MUST persistir no próprio navegador do aluno
  e sobreviver ao recarregamento.
- **FR-014**: MUST existir página do guia de instalação por trilha e página de prompts com
  Copiar.
- **FR-015**: MUST ser possível ver os problemas comuns (uv não reconhecido, SSL, 429, porta
  em uso) com causa e correção simuladas.
- **FR-016**: MUST existir modo Assistir (execução automática das etapas) e Reiniciar
  progresso com confirmação.
- **FR-017**: O bônus de metas semanais MUST estar disponível como etapa extra opcional no
  simulador do projeto.
- **FR-018**: Todo conteúdo MUST estar em pt-BR, funcionar sem internet e em telas de 375px.

### Key Entities

- **Trilha**: OpenCode ou Claude Code; define etapas específicas e o agente simulado.
- **Etapa**: terminal (cmd, PowerShell ou agente), comando esperado, variações aceitas,
  saída, dicas, arquivos criados.
- **Progresso**: trilha escolhida e etapas concluídas por simulador.
- **Arquivo simulado**: caminho e conteúdo exibidos na árvore do projeto.
- **Hábito**: nome, estado (ativo/arquivado), dias marcados (meta semanal opcional no bônus).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um iniciante conclui a instalação simulada de qualquer trilha em até 10
  minutos, sem ajuda do instrutor.
- **SC-002**: Um iniciante conclui o simulador do projeto (todas as etapas obrigatórias) em
  até 15 minutos.
- **SC-003**: Quem nunca viu o app cria um hábito e marca hoje em menos de 1 minuto.
- **SC-004**: 100% dos comandos e prompts exibidos são idênticos ao material do workshop.
- **SC-005**: O simulador abre e funciona por completo sem internet e sem instalar nada.
- **SC-006**: Nenhuma chave com formato real fica visível na tela ou salva após ser colada.

## Assumptions

- O público usa Windows; o simulador reproduz cmd e PowerShell do Windows.
- Os comandos da trilha Claude Code (instalação e login) não constam do guia original; vêm
  da documentação oficial do Claude Code e serão marcados "conferir na documentação".
- Versões aparecem genéricas (`0.x.y`, `v24.x.y`, `1.x.y`) como no guia original.
- O app final simulado guarda dados no navegador em vez do arquivo JSON do projeto real;
  isso é dito ao aluno como diferença da simulação.
- Copiar e colar é o modo principal; digitar à mão também funciona.
- O conteúdo é rascunho didático e passa por revisão humana antes de uso com turmas.
