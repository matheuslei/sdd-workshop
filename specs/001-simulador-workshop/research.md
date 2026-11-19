# Research: Simulador do Workshop SDD

## R1. Entrada de comandos multilinha (bloco do Node, prompts longos)
- **Decision**: campo `<textarea>` que cresce; Enter envia, Shift+Enter quebra linha.
- **Rationale**: o bloco PowerShell do Node e os prompts têm várias linhas; `<input>` perderia
  as quebras ao colar.
- **Alternatives**: `<input>` (perde linhas); `contenteditable` (colagem com formatação).

## R2. Comparação "colou o comando certo"
- **Decision**: normalizar (trim, espaços colapsados, aspas tipográficas → retas) e comparar
  sem diferenciar maiúsculas em comandos; prompts `/speckit.*` aceitos pelo **prefixo** do
  comando + texto não vazio (texto diferente do padrão gera aviso, não bloqueio); blocos
  multilinha aceitos se contêm todas as linhas-chave (`chaves: [...]`).
- **Rationale**: tolera variações inofensivas sem aceitar comando errado.
- **Alternatives**: igualdade exata (frágil); similaridade fuzzy (aceita erros reais).

## R3. Detecção de terminal errado
- **Decision**: cada etapa tem `shell`; se o texto bate com uma etapa de outro shell, ou tem
  marcadores de PowerShell (`$`, `irm`, `Invoke-`) numa etapa cmd (ou `set X=`/`%VAR%` numa
  etapa PowerShell), mostrar dica "terminal errado".

## R4. Detecção de chave real
- **Decision**: regex para `sk-or-v1-[0-9a-f]{16,}`, `sk-ant-[\w-]{16,}`, `sk-[A-Za-z0-9]{32,}`
  e qualquer `sk-or-` que não seja `sk-or-FALSA`. Checagem antes de eco, histórico e storage;
  o campo é limpo e um alerta explica o risco e manda revogar a chave.

## R5. Copiar em `file://`
- **Decision**: `navigator.clipboard.writeText` com fallback `document.execCommand("copy")`
  num textarea temporário; se ambos falharem, selecionar o texto e orientar Ctrl+C.

## R6. Trilha Claude Code (fora do guia original)
- **Decision**: instalação nativa no 🟦 PowerShell `irm https://claude.ai/install.ps1 | iex`,
  depois `claude --version` e `claude` (login simulado: escolher "conta Claude", "navegador
  aberto… login concluído"). Etapas marcadas **"conferir na documentação oficial"**
  (code.claude.com/docs) — o login real é feito pelo aluno no navegador, nunca no simulador.
- **Alternatives**: instalação via npm (descontinuada como recomendada).

## R7. Abrir o app final
- **Decision**: página própria `simulador/app-final.html` com moldura de navegador falso
  (barra `http://127.0.0.1:8000`), acessível pelo botão "Abrir no navegador" ao final do
  simulador do projeto e pelo índice. Sem iframe (localStorage em iframes `file://` é
  instável entre navegadores).

## R8. Regras do Monitor de hábitos
- Sequência: dias seguidos marcados terminando ontem; se hoje estiver marcado, soma hoje.
- Frequência 30 dias: dias marcados nos últimos 30 (incl. hoje) ÷ min(30, dias desde o
  início), onde início = o mais antigo entre a criação e a primeira marcação (dias passados
  podem ser marcados após criar o hábito); resultado limitado a 100%. Evita 3% injusto para
  hábito criado hoje e evita >100% ao marcar dias anteriores à criação.
- Semana exibida: 7 dias terminando hoje, deslocáveis de 7 em 7 para trás; datas futuras
  nunca são exibidas e o toggle recusa data > hoje (defesa dupla).
- Bônus metas: meta 1–7/semana; progresso na semana-calendário (seg–dom) do último dia
  exibido; sequência semanal = semanas completas seguidas com meta cumprida (a semana atual
  ainda aberta não quebra).

## R9. Modo Assistir
- **Decision**: o motor preenche o campo com a resposta esperada, "digita" e executa com pausa;
  respostas de clarify usam as respostas combinadas; chave usa a falsa.

## R11. Interfaces dos agentes (ilustrativas)
- **Decision**: o motor desenha cada agente com a "cara" dele, acionado pelos marcadores
  `abreAgente` / `fechaAgente` / `boasVindas` dos roteiros:
  - **OpenCode** (TUI de tela cheia): limpa o cmd ao abrir e o restaura no `/exit`; tela
    inicial com logo e atalhos; a 1ª mensagem abre a sessão; mensagem do usuário com barra
    pêssego; ferramentas `← Write arq`, `→ Read arq`, `$ comando`; rodapé `BUILD · modelo`;
    linha `▣ Build · modelo · Ns` ao fim de cada resposta.
  - **Claude Code v2** (inline no terminal, clone ilustrativo): caixa com título
    "Claude Code v2.x.y" na borda, mascote em blocos, modelo/plano, cwd, "Tips for getting
    started" e "Recent activity"; entrada entre duas linhas horizontais com `>` e menu de `/`
    abaixo dela; `● texto`; `● Write(arq)` + `⎿ Wrote N lines` com prévia numerada;
    `● Update(arq)` com diff vermelho/verde; `● Update Todos` com ☐/☒; spinner com verbo
    (Pondering…, Cogitating…) + tempo + tokens; **pedidos de permissão interativos** (Create/Edit
    file com prévia, Bash command) com opções 1–3 (setas, números, Enter, Esc ou clique) — a
    opção 2 liga "⏵⏵ accept edits on" no rodapé; no modo Assistir/Acelerar escolhe a opção 2.
  - Ambos: menu de sugestões ao digitar `/` (Tab completa), com os comandos `/speckit*`
    depois do `specify init`.
- Textos de interface ficam em inglês como nas ferramentas reais; o selo "interface
  ilustrativa" fica na barra do terminal, porque a aparência real muda entre versões.

## R10. Visual
- **Decision**: reaproveitar os tokens visuais de um curso anterior do autor
  (`--acc`, `--term-*`, tema `data-tema`) e as ideias do terminal e do player animado de lá
  (histórico ↑↓, digitação letra a letra, formatos `claude`/`tool`/`out`), copiados e
  adaptados, sem dependência entre projetos.
