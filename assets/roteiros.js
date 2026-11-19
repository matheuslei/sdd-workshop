/* Roteiros do simulador. Fonte da verdade: o material original do workshop, guardado fora do repositório
   (_local/material-workshop/guia-instalacao.md e _local/material-workshop/prompts-pratica.md).
   Comandos e prompts copiados literalmente. Saídas são ILUSTRATIVAS (versões genéricas 0.x.y). */
(function () {
  "use strict";
  function O(x, ms) { return { t: "out", x: x, ms: ms }; }
  function OK(x, ms) { return { t: "ok", x: x, ms: ms }; }
  function DIM(x, ms) { return { t: "dim", x: x, ms: ms }; }
  function WARN(x, ms) { return { t: "warn", x: x, ms: ms }; }
  function AG(x, ms) { return { t: "agente", x: x, ms: ms }; }
  function TOOL(x, ms) { return { t: "tool", x: x, ms: ms }; }
  function SUB(x, ms) { return { t: "sub", x: x, ms: ms }; }
  function H(x, ms) { return { t: "html", x: x, ms: ms }; }
  function CRIA(x, ms) { return { t: "cria", x: x, ms: ms }; }
  function PENSA(x, ms) { return { t: "pensa", x: x, ms: ms }; }
  var FASES = ["Fase 1 · Setup (dependências)", "Fase 2 · Base (servidor e arquivo de dados)", "Fase 3 · US1 grade e marcação (MVP)", "Fase 4 · US2 sequência e frequência", "Fase 5 · US3 semanas, renomear, arquivar, excluir"];
  function TODOS(feitos) { return { t: "todos", itens: FASES, feitos: feitos, ms: 350 }; }

  var U = "C:\\Users\\aluno";
  var FEAT = "specs/001-monitor-habitos/";

  // ---------- abrir/fechar o agente: o motor (sim.js) desenha a interface de cada um ----------
  var ABRE = { t: "abreAgente" }, FECHA = { t: "fechaAgente" }, BOAS_VINDAS = { t: "boasVindas" };

  function arquivosIniciais(c) {
    return [
      ".specify/memory/constitution.md@template",
      ".specify/templates/spec-template.md@v1",
      ".specify/templates/plan-template.md@v1",
      ".specify/templates/tasks-template.md@v1",
      c.trilha === "claude" ? ".claude/skills/speckit-specify/SKILL.md@v1" : ".opencode/command/speckit.specify.md@v1"
    ];
  }
  var ARQ_UV_INIT = ["pyproject.toml@v1", ".python-version@v1", "main.py@init", "README.md@init"];

  // =====================================================================
  // SIMULADOR 1 — INSTALAÇÃO (guia de instalação do workshop)
  // =====================================================================
  var P1 = "Parte 1 — Instalações", P2 = "Parte 2 — Verificação e configuração", P3 = "Criar o projeto do curso";

  var BLOCO_NODE = String.raw`# Acelera o download no Windows PowerShell 5.1
$ProgressPreference = 'SilentlyContinue'

# 1. Descobre a versão LTS mais recente
$lista  = Invoke-RestMethod https://nodejs.org/dist/index.json
$versao = ($lista | Where-Object { $_.lts } | Select-Object -First 1).version
Write-Host "Versão LTS encontrada: $versao"

# 2. Baixa o .zip para a pasta Downloads
$zip = "$env:USERPROFILE\Downloads\node-$versao-win-x64.zip"
Invoke-WebRequest "https://nodejs.org/dist/$versao/node-$versao-win-x64.zip" -OutFile $zip

# 3. Extrai na pasta de programas do usuário (não precisa de administrador)
$destino = "$env:LOCALAPPDATA\Programs"
New-Item -ItemType Directory -Force $destino | Out-Null
Expand-Archive $zip -DestinationPath $destino -Force
Remove-Item "$destino\nodejs" -Recurse -Force -ErrorAction SilentlyContinue
Rename-Item "$destino\node-$versao-win-x64" "nodejs"

# 4. Coloca o Node.js e os pacotes globais do npm no PATH do seu usuário
$nodeDir = "$destino\nodejs"
$npmDir  = "$env:APPDATA\npm"
New-Item -ItemType Directory -Force $npmDir | Out-Null
$pathUsuario = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$nodeDir;$npmDir;$pathUsuario", "User")

Write-Host "Node.js $versao instalado em $nodeDir"`;

  var instalacao = [
    { id: "uv", trilha: "comum", grupo: P1, titulo: "Instalar o uv", shell: "cmd", novaJanela: true,
      explica: "<p>O <b>uv</b> é o gerenciador de Python e de pacotes. É <b>obrigatório</b>, mesmo que você não programe em Python, porque é ele que instala o Spec Kit.</p><p>Repare: estamos no ⬛ <b>cmd</b>, mas o comando chama o PowerShell por dentro. Copie a linha inteira.</p>",
      comando: 'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"',
      dicas: [[/^\s*irm\s/i, "No cmd o comando precisa começar com <code>powershell -ExecutionPolicy ByPass -c</code>. Copie a linha inteira."]],
      saida: [O("Downloading uv 0.x.y (x86_64-pc-windows-msvc)", 500), O("Installing to " + U + "\\.local\\bin", 300), O("  uv.exe"), O("  uvx.exe"), O("  uvw.exe"), OK("everything's installed!", 300),
        WARN("\n⚠ Feche e abra o cmd depois desta etapa. Só assim o comando uv passa a ser encontrado.")],
      depois: "A próxima etapa abre um cmd novo (a simulação faz isso por você)." },
    { id: "uv-tls", trilha: "comum", grupo: P1, titulo: "Python: ajustar certificados", shell: "cmd", novaJanela: true,
      explica: "<p>O Spec Kit exige Python 3.11 ou superior. Antes de instalar, este comando faz o uv usar os certificados do Windows (útil em redes de empresa). Ele não mostra mensagem nenhuma.</p>",
      comando: "set UV_NATIVE_TLS=true",
      saida: [DIM("(sem mensagem: o comando só define uma variável nesta janela do cmd)")] },
    { id: "python", trilha: "comum", grupo: P1, titulo: "Instalar o Python 3.12", shell: "cmd",
      explica: "<p>Agora o uv baixa e instala o Python 3.12 na sua pasta de usuário.</p>",
      comando: "uv python install 3.12",
      saida: [DIM("Downloading cpython-3.12.x-windows-x86_64-none (download)", 700), O("Installed Python 3.12.x in 4.21s", 200), OK(" + cpython-3.12.x-windows-x86_64-none")] },
    { id: "specify-cli", trilha: "comum", grupo: P1, titulo: "Instalar o Spec Kit", shell: "cmd",
      explica: "<p>O <b>Spec Kit</b> (comando <code>specify</code>) é o kit do GitHub para SDD: cria a estrutura do projeto e os comandos <code>/speckit.*</code>.</p>",
      comando: "uv tool install specify-cli",
      saida: [DIM("Resolved 20 packages in 1.2s", 500), DIM("Installed 20 packages in 300ms", 300), OK("Installed 1 executable: specify")] },
    { id: "update-shell", trilha: "comum", grupo: P1, titulo: "Colocar as ferramentas no PATH", shell: "cmd",
      explica: "<p>Garante que as ferramentas instaladas pelo uv (como o <code>specify</code>) fiquem no PATH.</p>",
      comando: "uv tool update-shell",
      saida: [O("Updated PATH to include executable directory " + U + "\\.local\\bin"), DIM("Restart your shell to apply changes")] },

    // --- trilha OpenCode ---
    { id: "node", trilha: "opencode", grupo: P1, titulo: "Instalar o Node.js (portátil)", shell: "ps", novaJanela: true, modo: "bloco",
      explica: "<p>Único passo feito no 🟦 <b>PowerShell</b>. O OpenCode é instalado pelo npm, que vem junto com o Node.js. O bloco baixa a versão LTS e instala na sua pasta, <b>sem administrador</b>.</p><p>Copie e cole o <b>bloco inteiro</b>.</p>",
      comando: BLOCO_NODE,
      chaves: ["invoke-restmethod https://nodejs.org/dist/index.json", "invoke-webrequest", "expand-archive", "setenvironmentvariable(\"path\", \"$nodedir;$npmdir;$pathusuario\", \"user\")", "write-host \"node.js $versao instalado em $nodedir\""],
      saida: [O("Versão LTS encontrada: v24.x.y", 900), DIM("(baixando e extraindo o .zip…)", 900), OK("Node.js v24.x.y instalado em " + U + "\\AppData\\Local\\Programs\\nodejs"),
        WARN("\nFeche o PowerShell. Daqui em diante, tudo é no cmd.")] },
    { id: "npm-prefix", trilha: "opencode", grupo: P1, titulo: "Configurar a pasta do npm", shell: "cmd", novaJanela: true,
      explica: "<p>Abra um <b>novo cmd</b> (para ele já enxergar o Node.js). Estes comandos <b>não</b> funcionam corretamente no PowerShell.</p>",
      comando: 'npm config set prefix "%APPDATA%\\npm"',
      saida: [DIM("(sem mensagem)")] },
    { id: "npm-get", trilha: "opencode", grupo: P1, titulo: "Conferir a pasta do npm", shell: "cmd",
      explica: "<p>Confira se a configuração anterior ficou certa.</p>",
      comando: "npm config get prefix",
      saida: [O(U + "\\AppData\\Roaming\\npm")] },
    { id: "opencode-install", trilha: "opencode", grupo: P1, titulo: "Instalar o OpenCode", shell: "cmd",
      explica: "<p>O <b>OpenCode</b> é o agente de programação no terminal. É nele que você vai rodar os comandos <code>/speckit.*</code>.</p>",
      comando: "npm install -g opencode-ai --allow-scripts=opencode-ai",
      saida: [DIM("⠙ reify:opencode-ai: timing reifyNode…", 1200), OK("added 4 packages in 9s")] },

    // --- trilha Claude Code ---
    { id: "claude-install", trilha: "claude", grupo: P1, titulo: "Instalar o Claude Code", shell: "ps", novaJanela: true, conferir: true,
      explica: "<p>Na trilha Claude Code, o agente é o <b>Claude Code</b>. A instalação nativa é feita no 🟦 <b>PowerShell</b>, sem administrador.</p><p>⚠️ Este passo não está no guia do workshop: confira o comando e os requisitos atuais na documentação oficial (<code>code.claude.com/docs</code>).</p>",
      comando: "irm https://claude.ai/install.ps1 | iex",
      saida: [O("Setting up Claude Code...", 900), OK("✔ Claude Code successfully installed!"), O("  Version: 2.x.y"), O("  Location: " + U + "\\.local\\bin\\claude.exe"),
        WARN("\nFeche o PowerShell. Daqui em diante, tudo é no cmd.")] },

    { id: "reiniciar", trilha: "comum", grupo: P1, titulo: "🔄 Reiniciar a máquina", shell: "cmd", modo: "botao", botao: "🔄 Reiniciar a máquina (simulado)",
      explica: "<p>Com tudo instalado, <b>reinicie o computador</b>. Isso garante que o PATH (a lista de pastas onde o sistema procura os comandos) esteja atualizado. Muitos erros de \"comando não encontrado\" desaparecem só com isso.</p>",
      saida: [DIM("Reiniciando…", 1200), OK("✓ Máquina reiniciada. PATH atualizado."), DIM("Abra um cmd e siga para a Parte 2.")] },

    { id: "uv-v", trilha: "comum", grupo: P2, titulo: "Verificar o uv", shell: "cmd", novaJanela: true,
      explica: "<p>Toda a Parte 2 é feita no ⬛ cmd. Os números de versão no seu computador vão ser diferentes, e tudo bem: o importante é responder com uma versão, sem erro.</p>",
      comando: "uv --version", saida: [O("uv 0.x.y (a1b2c3d4 2026-xx-xx)")] },
    { id: "py-list", trilha: "comum", grupo: P2, titulo: "Verificar o Python", shell: "cmd",
      explica: "<p>Deve aparecer pelo menos uma linha com <code>cpython-3.12</code>.</p>",
      comando: "uv python list --only-installed",
      saida: [O("cpython-3.12.x-windows-x86_64-none    " + U + "\\AppData\\Roaming\\uv\\python\\cpython-3.12.x-windows-x86_64-none\\python.exe")] },
    { id: "specify-v", trilha: "comum", grupo: P2, titulo: "Verificar o Spec Kit", shell: "cmd",
      explica: "<p>Mostra um painel com informações do Specify CLI: versão, Python e sistema operacional.</p>",
      comando: "specify version",
      saida: [H('<span class="t-caixa"><span class="t-acc t-b">Specify CLI Information</span>\n  CLI Version     X.Y.Z\n  Python          3.12.x\n  Platform        Windows\n  Architecture    AMD64</span>')] },
    { id: "specify-check", trilha: "comum", grupo: P2, titulo: "Checar as ferramentas", shell: "cmd",
      explica: function (c) { return "<p>Mostra uma lista de ferramentas. É normal várias aparecerem como não encontradas: só o <b>" + (c.trilha === "claude" ? "claude" : "opencode") + "</b> precisa estar disponível.</p>"; },
      comando: "specify check",
      saida: function (c) {
        return [O("Checking for installed tools...", 500), O("git          ✓ available"),
          c.trilha === "claude" ? OK("claude       ✓ available") : DIM("claude       ✗ not found"),
          DIM("gemini       ✗ not found"),
          c.trilha === "opencode" ? OK("opencode     ✓ available") : DIM("opencode     ✗ not found"),
          DIM("..."), OK("\nSpecify CLI is ready to use!")];
      } },
    { id: "node-v", trilha: "opencode", grupo: P2, titulo: "Verificar o Node.js", shell: "cmd", comando: "node --version", saida: [O("v24.x.y")] },
    { id: "npm-v", trilha: "opencode", grupo: P2, titulo: "Verificar o npm", shell: "cmd", comando: "npm --version", saida: [O("11.x.y")] },
    { id: "opencode-v", trilha: "opencode", grupo: P2, titulo: "Verificar o OpenCode", shell: "cmd",
      explica: "<p>Resultado esperado: um número que <b>começa com 1</b>.</p>", comando: "opencode --version", saida: [O("1.x.y")] },
    { id: "or-chave", trilha: "opencode", grupo: P2, titulo: "Criar a chave do OpenRouter", shell: "cmd", modo: "botao", botao: "🔑 Gerar chave FALSA (simulado)",
      explica: "<p>Na vida real: crie uma conta em <code>openrouter.ai</code>, vá em <b>Keys</b> → <b>Create Key</b>, dê um nome como <code>curso-sdd</code> e <b>defina um limite de crédito</b>. A chave começa com <code>sk-or-...</code> e aparece <b>uma única vez</b>.</p><div class='aviso err'>🔐 Nunca cole a chave em código, arquivos do projeto, prints ou chats. Se vazar, revogue-a e crie outra. <b>Neste simulador use só a chave falsa.</b></div>",
      saida: [OK("Chave criada (FALSA, só para a simulação): sk-or-FALSA-curso-sdd"), DIM("Nome: curso-sdd · limite de crédito: US$ 1,00"), WARN("Na vida real ela aparece uma única vez. Guarde num lugar seguro.")] },
    { id: "opencode-abrir", trilha: "opencode", grupo: P2, titulo: "Abrir o OpenCode", shell: "cmd",
      explica: "<p>Agora vamos conectar o OpenCode ao OpenRouter. Primeiro abra o OpenCode.</p>",
      comando: "opencode", saida: [DIM("(abrindo o OpenCode…)", 300), ABRE] },
    { id: "connect", trilha: "opencode", grupo: P2, titulo: "/connect", shell: "agente",
      explica: "<p>Dentro do OpenCode, digite <code>/connect</code> e pressione Enter.</p>", comando: "/connect",
      saida: [O("Selecione o provedor:"), DIM("  Anthropic\n  GitHub Copilot\n  OpenAI"), O("› OpenRouter"), DIM("  …")] },
    { id: "provedor", trilha: "opencode", grupo: P2, titulo: "Escolher o OpenRouter", shell: "agente",
      explica: "<p>Procure por <b>OpenRouter</b> e selecione.</p>", comando: "OpenRouter", aceitos: ["open router"],
      saida: [O("Cole a sua chave de API do OpenRouter:")] },
    { id: "chave", trilha: "opencode", grupo: P2, titulo: "Colar a chave (falsa)", shell: "agente", modo: "chave",
      explica: "<p>Cole a chave quando for solicitado. <b>Aqui, só a chave falsa.</b> Se você colar algo com cara de chave real, o simulador descarta e avisa.</p>",
      comando: "sk-or-FALSA-curso-sdd",
      saida: [OK("✓ OpenRouter conectado."), DIM("A chave fica nas credenciais locais do OpenCode, fora de qualquer projeto.")] },
    { id: "models", trilha: "opencode", grupo: P2, titulo: "/models", shell: "agente",
      explica: "<p>Digite <code>/models</code> para ver a lista de modelos do OpenRouter.</p>", comando: "/models",
      saida: [O("Modelos disponíveis (OpenRouter):"), DIM("  OpenRouter › …"), O("  OpenRouter › Nemotron 3.5 Super VL (free)"), DIM("  OpenRouter › …")] },
    { id: "modelo", trilha: "opencode", grupo: P2, titulo: "Escolher o modelo", shell: "agente",
      explica: "<p>Selecione o modelo que o curso vai usar.</p>", comando: "Nemotron 3.5 Super VL (free)",
      saida: [OK("✓ Modelo selecionado: OpenRouter › Nemotron 3.5 Super VL (free)")] },
    { id: "claude-v", trilha: "claude", grupo: P2, titulo: "Verificar o Claude Code", shell: "cmd", conferir: true,
      comando: "claude --version", saida: [O("2.x.y (Claude Code)")] },
    { id: "claude-abrir", trilha: "claude", grupo: P2, titulo: "Abrir o Claude Code", shell: "cmd", conferir: true,
      explica: "<p>Na primeira vez, o Claude Code pede para você entrar na sua conta.</p>", comando: "claude",
      saida: [ABRE, O("Select login method:"), H('<span class="t-acc"> ❯ 1. Claude account with subscription</span>'), O("   2. Anthropic Console account · API usage billing")] },
    { id: "claude-login", trilha: "claude", grupo: P2, titulo: "Entrar na conta (simulado)", shell: "agente", conferir: true,
      explica: "<p>Na vida real, o navegador abre e você entra com <b>a sua conta no site oficial</b>. Nunca digite senha em outro lugar. Aqui, digite apenas <code>1</code>.</p>",
      comando: "1",
      saida: [DIM("Opening browser to sign in… (simulado: na vida real, entre no site oficial)", 1000), OK("Login successful. Press Enter to continue…"), BOAS_VINDAS] },
    { id: "teste", trilha: "comum", grupo: P2, titulo: "Teste rápido", shell: "agente",
      explica: "<p>Ainda dentro do agente, envie a mensagem abaixo. O modelo deve responder <code>ok</code> em poucos segundos.</p>",
      comando: "Responda apenas: ok", saida: [PENSA("Pensando…", 900), AG("ok")] },
    { id: "sair", trilha: "comum", grupo: P2, titulo: "Sair do agente", shell: "agente",
      explica: "<p>Saia com <code>Ctrl+C</code> ou <code>/exit</code>.</p>", comando: "/exit",
      saida: [FECHA, DIM("(de volta ao cmd)")] },

    { id: "init", trilha: "comum", grupo: P3, titulo: "Inicializar com o Spec Kit", shell: "cmd",
      explica: "<p>Cria a pasta do projeto com os templates, scripts e os comandos <code>/speckit.*</code> para o seu agente.</p>",
      comando: function (c) { return "specify init sdd-workshop --integration " + (c.trilha === "claude" ? "claude" : "opencode") + " --script ps"; },
      saida: function (c) {
        return [H('<span class="t-acc t-b">SPECIFY</span> <span class="t-dim">— GitHub Spec Kit</span>'), O("Initialize Specify Project", 300),
          OK("✓ Check required tools"), OK("✓ Select integration (" + (c.trilha === "claude" ? "claude" : "opencode") + ")"), OK("✓ Copy templates"), OK("✓ Install " + (c.trilha === "claude" ? "skills" : "commands")), OK("✓ Finalize"),
          H('<span class="t-caixa"><span class="t-b">Next Steps</span>\n1. cd sdd-workshop\n2. Start using ' + (c.trilha === "claude" ? "skills" : "slash commands") + " with your coding agent:\n   " +
            (c.trilha === "claude" ? "/speckit-constitution · /speckit-specify · /speckit-plan · /speckit-tasks · /speckit-implement" : "/speckit.constitution · /speckit.specify · /speckit.plan · /speckit.tasks · /speckit.implement") + "</span>")];
      },
      cria: arquivosIniciais },
    { id: "cd", trilha: "comum", grupo: P3, titulo: "Entrar na pasta", shell: "cmd", entra: "sdd-workshop",
      comando: "cd sdd-workshop", saida: [DIM("(sem mensagem: o caminho do prompt muda)")] },
    { id: "uv-init", trilha: "comum", grupo: P3, titulo: "Preparar o ambiente Python", shell: "cmd",
      explica: "<p>Prepara o projeto Python (cria <code>pyproject.toml</code>). Não é preciso ativar o <code>.venv</code> na mão: <code>uv run</code> faz isso por você.</p>",
      comando: "uv init --python 3.12", saida: [O("Initialized project `sdd-workshop`")], cria: ARQ_UV_INIT },
    { id: "abrir-final", trilha: "comum", grupo: P3, titulo: "Abrir o agente na raiz do projeto", shell: "cmd",
      explica: "<p>Abra o agente <b>na raiz do projeto</b> (a pasta que contém <code>.specify</code>).</p>",
      comando: function (c) { return c.cmdAgente; }, saida: [ABRE] },
    { id: "speckit-lista", trilha: "comum", grupo: P3, titulo: "Confirmar os comandos /speckit", shell: "agente",
      explica: function (c) { return "<p>Digite <code>/speckit</code>: deve aparecer a lista de comandos do Spec Kit." + (c.trilha === "claude" ? " No Claude Code eles aparecem com hífen (<code>/speckit-plan</code>)." : "") + "</p>"; },
      comando: "/speckit", aceitos: ["/speckit."],
      saida: function (c) {
        var s = c.trilha === "claude" ? "-" : ".";
        return [O(["constitution", "specify", "clarify", "plan", "tasks", "analyze", "implement", "checklist"].map(function (n) { return "  /speckit" + s + n; }).join("\n")),
          OK("\n✓ Ambiente pronto para o workshop!")];
      } }
  ];

  // =====================================================================
  // SIMULADOR 2 — PROJETO (prompts da prática do workshop)
  // =====================================================================
  var G0 = "Passo 0 · Preparar (no cmd)", GS = "Etapas SDD (no agente)", GR = "Rodar o app (no segundo cmd)", GB = "Bônus · O requisito mudou (para casa)";

  var PROMPT_CONSTITUTION = `/speckit.constitution Crie a constituição de um monitor de hábitos pessoal, usado por uma pessoa no próprio computador.
1. Simplicidade: o mínimo de arquivos e dependências; sem framework de frontend e sem etapa de build. Entre duas soluções, escolha a mais fácil de entender para quem nunca programou.
2. Local e offline: roda só em 127.0.0.1, sem login, sem banco de dados e sem nuvem. O app não chama a internet, nem modelos de IA, nem nenhum serviço externo.
3. Dados do usuário: ficam num arquivo JSON legível dentro da pasta do projeto, nunca são apagados sem confirmação e a gravação não pode corromper o arquivo.
4. Para iniciantes: interface e mensagens em português do Brasil; todo erro diz o que fazer; comentários curtos explicam a intenção do código.
5. Fácil de rodar: um único comando sobe o app, documentado no README. Sem testes automatizados nesta versão.
Restrições: Windows sem permissão de administrador, terminal cmd, Python 3.12 gerenciado pelo uv. A spec é a fonte da verdade: mudança de requisito começa nela.`;

  var PROMPT_SPECIFY = `/speckit.specify Quero um monitor de hábitos pessoal: minimalista, flexível e muito simples de usar.
Problema: acompanhar se estou mantendo hábitos (beber água, ler, caminhar) sem um app cheio de telas, sem criar conta e sem meus dados saírem do computador. Usuário: uma pessoa, no próprio computador, sem login.
Em ordem de prioridade, preciso:
1. Ver uma grade com os hábitos nas linhas e os últimos 7 dias nas colunas; um clique marca o dia como feito e outro desmarca. Criar um hábito só com o nome.
2. Ver, por hábito, a sequência atual (dias seguidos) e a frequência dos últimos 30 dias, em %.
3. Voltar a semanas anteriores e corrigir dias passados à mão (dias futuros não podem ser marcados); renomear, arquivar e excluir hábitos, com confirmação para excluir.
Critérios de aceite: marcar ou desmarcar leva um clique e continua salvo depois de fechar e reabrir; os dados ficam num arquivo da pasta do projeto que consigo abrir e ler; tudo funciona sem internet; quem nunca viu o app cria um hábito e marca hoje em menos de 1 minuto.
Fora de escopo: metas semanais, lembretes, análise com IA, vários usuários, celular e sincronização.`;

  var PROMPT_CLARIFY = "/speckit.clarify Faça no máximo 2 perguntas, uma por vez, cada uma com uma opção recomendada: o que conta como sequência e a diferença entre arquivar e excluir. Para as outras dúvidas, assuma a opção mais simples e registre a decisão na spec.";

  var PROMPT_PLAN = `/speckit.plan Use a arquitetura mais simples possível:
- Servidor local: Python 3.12 com FastAPI e Uvicorn, dependências instaladas com uv add. Escuta só em 127.0.0.1:8000 e serve a página e uma API JSON pequena.
- Página: index.html, style.css e app.js em HTML, CSS e JavaScript puros, sem framework e sem build.
- Dados: arquivo data/habitos.json, criado vazio se não existir; grava num arquivo temporário e depois substitui.
- Comando: uv run python main.py sobe o app. Sem testes automatizados.
Registre o formato do JSON, a lista de endpoints e as alternativas descartadas (SQLite, React, guardar no navegador), com o motivo.`;

  var PROMPT_TASKS = "/speckit.tasks Mantenha a organização por histórias de usuário, com o MVP (história 1: grade e marcação) primeiro. Poucas tarefas, cada uma com o requisito da spec que atende e como conferir à mão. Não inclua testes automatizados.";

  var PROMPT_ANALYZE = "/speckit.analyze Liste só os problemas, do mais grave para o menos grave: requisito ou critério de aceite sem tarefa, tarefa sem requisito e qualquer conflito com a constituição (simplicidade, offline, dados).";

  var PROMPT_IMPLEMENT = "/speckit.implement Implemente todas as tarefas, na ordem do tasks.md, sem parar para pedir confirmação entre elas. Não crie testes automatizados. Marque cada tarefa concluída no tasks.md. No fim, diga em até 3 linhas como rodar e o que conferir.";

  var PROMPT_BONUS = "/speckit.specify Nova funcionalidade para o monitor de hábitos existente: metas semanais. Cada hábito pode ser diário (padrão) ou ter uma meta de 1 a 7 vezes por semana. Na grade, um hábito semanal mostra o progresso da semana, por exemplo “2 de 3”. A sequência de um hábito semanal conta semanas seguidas com a meta cumprida.";

  var RESP_SEQ = "Hoje ainda sem marcação não quebra a sequência; ela conta até ontem.";
  var RESP_ARQ = "Arquivar esconde e guarda o histórico; excluir apaga tudo, depois de confirmar.";

  var projeto = [
    { id: "p0-cd", grupo: G0, titulo: "Entrar na pasta do projeto", shell: "cmd", novaJanela: true, entra: "sdd-workshop",
      explica: "<p>Se na instalação você precisou de <code>set UV_NATIVE_TLS=true</code>, na vida real rode antes <code>setx UV_NATIVE_TLS true</code> e abra um cmd novo.</p>",
      comando: "cd sdd-workshop", saida: [DIM("(sem mensagem: o caminho do prompt muda)")], cria: arquivosIniciais },
    { id: "p0-uv", grupo: G0, titulo: "Preparar o projeto Python", shell: "cmd",
      comando: "uv init --python 3.12", saida: [O("Initialized project `sdd-workshop`")], cria: ARQ_UV_INIT },
    { id: "p0-gitignore", grupo: G0, titulo: "Ignorar a pasta de dados", shell: "cmd",
      explica: "<p>Coloca <code>data/</code> no <code>.gitignore</code>: seus dados pessoais não vão para o controle de versão.</p>",
      comando: "echo data/>>.gitignore", saida: [DIM("(sem mensagem)")], cria: [".gitignore@v1"] },
    { id: "p0-agente", grupo: G0, titulo: "Abrir o agente", shell: "cmd",
      explica: function (c) { return "<p>O " + c.agente + " abre já " + (c.trilha === "claude" ? "logado na sua conta" : "conectado ao OpenRouter") + ". O app em si não usa IA nem chave.</p>"; },
      comando: function (c) { return c.cmdAgente; }, saida: [ABRE] },

    { id: "constitution", grupo: GS, titulo: "Etapa 1 · Constitution", shell: "agente", modo: "prefixo",
      explica: "<p>A <b>constituição</b> são os princípios que valem para todo o projeto. Toda decisão posterior (spec, plano, código) é conferida contra ela.</p>",
      comando: PROMPT_CONSTITUTION,
      corrige: "Edite .specify/memory/constitution.md: remova o que eu não pedi e mantenha só os 5 princípios e as restrições que passei. Não mude o resto.",
      saida: [PENSA("Lendo o template da constituição…"), TOOL("Read(.specify/memory/constitution.md)", 300), SUB("Template com 5 princípios e marcadores [PRINCIPLE_N]"),
        AG("Vou preencher a constituição com os 5 princípios e as restrições que você passou.", 500),
        CRIA(".specify/memory/constitution.md@v1", 600),
        AG("Constituição v1.0.0 criada:\n  I. Simplicidade · II. Local e offline · III. Dados do usuário\n  IV. Para iniciantes · V. Fácil de rodar\n  Restrições: Windows sem admin, cmd, Python 3.12 com uv.\nPróximo passo: /speckit.specify")] },
    { id: "specify", grupo: GS, titulo: "Etapa 2 · Specify", shell: "agente", modo: "prefixo",
      explica: "<p>A <b>spec</b> descreve <b>o quê</b> e <b>por quê</b>, sem tecnologia. Repare que ela vira histórias de usuário com prioridade e critérios de aceite.</p>",
      comando: PROMPT_SPECIFY,
      corrige: "Tire da spec.md qualquer menção a tecnologia (linguagem, framework, formato de arquivo). Isso vai para o plano.",
      saida: [PENSA("Analisando a descrição…"), TOOL("Bash(.specify/scripts/powershell/create-new-feature.ps1 \"monitor-habitos\")", 400), SUB("FEATURE_DIR: specs/001-monitor-habitos"),
        CRIA(FEAT + "spec.md@v1", 700), CRIA(FEAT + "checklists/requirements.md@v1", 400),
        AG("Spec criada em specs/001-monitor-habitos/spec.md:\n  • US1 (P1) grade de hábitos × 7 dias e marcação com um clique\n  • US2 (P2) sequência atual e frequência em 30 dias\n  • US3 (P3) semanas anteriores, renomear, arquivar e excluir\nFicaram 2 pontos [NEEDS CLARIFICATION]: o que conta como sequência e arquivar × excluir.\nPróximo passo: /speckit.clarify")] },
    { id: "clarify", grupo: GS, titulo: "Etapa 3 · Clarify", shell: "agente", modo: "prefixo",
      explica: "<p>O <b>clarify</b> elimina ambiguidades antes do plano. O agente faz uma pergunta por vez, com uma opção recomendada.</p>",
      comando: PROMPT_CLARIFY,
      saida: [PENSA("Procurando ambiguidades na spec…"), TOOL("Read(" + FEAT + "spec.md)", 300),
        H('<span class="t-caixa"><span class="t-acc t-b">Pergunta 1 de 2 — Sequência</span>\nSe hoje ainda não foi marcado, a sequência quebra?\n  <span class="t-ok">A (recomendada)</span> Hoje sem marcação não quebra; a sequência conta até ontem.\n  B Quebra assim que o dia vira sem marcação.\nResponda com a letra ou com o seu texto.</span>')] },
    { id: "clarify-r1", grupo: GS, titulo: "Clarify · resposta 1 (sequência)", shell: "agente", modo: "livre",
      explica: "<p>Use a <b>resposta combinada da turma</b>.</p>", comando: RESP_SEQ, opcoes: [RESP_SEQ, "A"],
      saida: [OK("✓ Registrado na spec."),
        H('<span class="t-caixa"><span class="t-acc t-b">Pergunta 2 de 2 — Arquivar × excluir</span>\nQual a diferença entre arquivar e excluir um hábito?\n  <span class="t-ok">A (recomendada)</span> Arquivar esconde e guarda o histórico; excluir apaga tudo, depois de confirmar.\n  B Os dois escondem; nada é apagado.\nResponda com a letra ou com o seu texto.</span>')] },
    { id: "clarify-r2", grupo: GS, titulo: "Clarify · resposta 2 (arquivar × excluir)", shell: "agente", modo: "livre",
      explica: "<p>Use a <b>resposta combinada da turma</b>. As outras dúvidas a IA resolve pela opção mais simples e anota na spec.</p>",
      comando: RESP_ARQ, opcoes: [RESP_ARQ, "A"],
      saida: [OK("✓ Registrado na spec."), CRIA(FEAT + "spec.md@clarify", 600),
        AG("Clarify concluído: 2 perguntas respondidas e registradas em \"## Clarifications\".\nOutras decisões pela opção mais simples (ex.: nome do hábito com até 40 caracteres).\nNenhum [NEEDS CLARIFICATION] restante. Próximo passo: /speckit.plan")] },
    { id: "plan", grupo: GS, titulo: "Etapa 4 · Plan", shell: "agente", modo: "prefixo",
      explica: "<p>O <b>plano</b> é o <b>como</b>: tecnologia, estrutura de arquivos, formato dos dados e endpoints. Aqui entram FastAPI, JSON etc.</p>",
      comando: PROMPT_PLAN,
      corrige: "No plan.md, troque [o que veio] por [o que você quer] e registre o motivo na seção de alternativas. Atualize data-model.md e contracts/ se algo mudar.",
      saida: [PENSA("Lendo spec e constituição…"), TOOL("Bash(.specify/scripts/powershell/setup-plan.ps1 -Json)", 300),
        CRIA(FEAT + "plan.md@v1", 500), CRIA(FEAT + "research.md@v1", 300), CRIA(FEAT + "data-model.md@v1", 300), CRIA(FEAT + "contracts/api.md@v1", 300), CRIA(FEAT + "quickstart.md@v1", 300),
        AG("Plano pronto: FastAPI + Uvicorn em 127.0.0.1:8000, página em HTML/CSS/JS puros, dados em data/habitos.json com gravação atômica.\nConstitution Check: ✓ todos os 5 princípios.\nAlternativas descartadas registradas: SQLite, React, guardar no navegador.\nPróximo passo: /speckit.tasks")] },
    { id: "tasks", grupo: GS, titulo: "Etapa 5 · Tasks", shell: "agente", modo: "prefixo",
      explica: "<p>As <b>tarefas</b> quebram o plano em passos pequenos, organizados por história, com o MVP primeiro.</p>",
      comando: PROMPT_TASKS,
      saida: [PENSA("Gerando tarefas a partir do plano…"), CRIA(FEAT + "tasks.md@v1", 600),
        AG("tasks.md criado: 10 tarefas em 6 fases.\n  Fase 1-2: setup e base (servidor + arquivo de dados)\n  Fase 3: US1 grade e marcação ← MVP\n  Fase 4: US2 sequência e frequência\n  Fase 5: US3 semanas, renomear, arquivar, excluir\nCada tarefa cita o requisito (FR-xxx) e como conferir à mão.")] },
    { id: "analyze", grupo: GS, titulo: "Analyze (checagem de consistência)", shell: "agente", modo: "prefixo", opcional: true,
      explica: "<p>Opcional: confere se spec, plano e tarefas estão coerentes entre si e com a constituição. Não altera arquivos.</p>",
      comando: PROMPT_ANALYZE,
      saida: [PENSA("Cruzando spec.md, plan.md e tasks.md…"),
        H('<span class="t-caixa"><span class="t-b">Relatório de análise</span>\n| Gravidade | Problema |\n| <span class="t-warn">MÉDIO</span>   | Critério "criar hábito e marcar hoje em menos de 1 minuto" sem tarefa de conferência explícita. |\n| BAIXO     | T001 (instalar dependências) não cita um requisito da spec, só o plano. |\n<span class="t-ok">Nenhum conflito com a constituição.</span></span>'),
        AG("Sugestão: acrescentar a conferência do critério de 1 minuto em T006 (já cita SC-001, falta o passo cronometrado). Posso aplicar se você pedir.")] },
    { id: "implement", grupo: GS, titulo: "Etapa 6 · Implement", shell: "agente", modo: "prefixo",
      explica: "<p>O agente executa as tarefas na ordem do <code>tasks.md</code> e escreve o código. Observe a árvore de arquivos crescer.</p>",
      comando: PROMPT_IMPLEMENT,
      saida: [PENSA("Lendo tasks.md…"), TODOS(0), AG("Fase 1 · Setup"),
        TOOL("Bash(uv add fastapi uvicorn)", 300), SUB("Resolved 18 packages in 1.1s\nAdded fastapi, uvicorn", 500), CRIA("pyproject.toml@impl", 300),
        TODOS(1), AG("Fase 2 · Base"), CRIA("main.py@v1", 700),
        TODOS(2), AG("Fase 3 · US1 grade e marcação (MVP)"), CRIA("static/index.html@v1", 500), CRIA("static/style.css@v1", 400), CRIA("static/app.js@v1", 700),
        TODOS(3), AG("Fase 4 · US2 sequência e frequência"), { t: "cria", x: "static/app.js@v1", verbo: "Update", ms: 400 },
        TODOS(4), AG("Fase 5 · US3 semanas, renomear, arquivar, excluir"), { t: "cria", x: "static/app.js@v1", verbo: "Update", ms: 400 }, CRIA("README.md@v1", 300),
        { t: "cria", x: FEAT + "tasks.md@feito", verbo: "Update", ms: 400 }, SUB("10/10 tarefas marcadas [X]"), TODOS(5),
        AG("Pronto!\nPara rodar: uv run python main.py (num segundo cmd, dentro da pasta).\nAbra http://127.0.0.1:8000 e confira: crie um hábito, marque hoje e recarregue a página.")] },

    { id: "rodar-cd", grupo: GR, titulo: "Abrir o segundo cmd", shell: "cmd", novaJanela: true, entra: "sdd-workshop",
      explica: "<p>Deixe o agente aberto na primeira janela. Abra um <b>segundo cmd</b> e entre na pasta do projeto.</p>",
      comando: "cd sdd-workshop", saida: [DIM("(sem mensagem)")] },
    { id: "rodar", grupo: GR, titulo: "Subir o app", shell: "cmd",
      explica: "<p>Sobe o servidor local. Para parar: <code>Ctrl+C</code>.</p>",
      comando: "uv run python main.py",
      saida: [DIM("Using CPython 3.12.x\nCreating virtual environment at: .venv\nInstalled 18 packages in 1.4s", 800), O("INFO:     Started server process [4242]"), O("INFO:     Waiting for application startup."),
        O("INFO:     Application startup complete."), OK("INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)")],
      fim: "abrirApp",
      depois: "Abra o app no navegador (simulado)." },

    { id: "bonus-specify", grupo: GB, titulo: "Bônus · Specify (metas semanais)", shell: "agente", novaJanela: true, modo: "prefixo", opcional: true,
      explica: "<p>O requisito mudou! Mudança de requisito começa na <b>spec</b>: uma nova feature, <code>002-metas-semanais</code>.</p>",
      comando: PROMPT_BONUS,
      saida: [PENSA("Analisando a nova funcionalidade…"), TOOL("Bash(.specify/scripts/powershell/create-new-feature.ps1 \"metas-semanais\")", 300),
        CRIA("specs/002-metas-semanais/spec.md@v1", 600), AG("Spec 002 criada. Siga com /speckit.clarify (opcional), /speckit.plan, /speckit.tasks e /speckit.implement.")] },
    { id: "bonus-plan", grupo: GB, titulo: "Bônus · Plan", shell: "agente", opcional: true, comando: "/speckit.plan",
      saida: [PENSA("Planejando…"), CRIA("specs/002-metas-semanais/plan.md@v1", 500), AG("Plano: campo opcional \"meta\" (1 a 7) em cada hábito; progresso da semana calculado na página.")] },
    { id: "bonus-tasks", grupo: GB, titulo: "Bônus · Tasks", shell: "agente", opcional: true, comando: "/speckit.tasks",
      saida: [CRIA("specs/002-metas-semanais/tasks.md@v1", 500), AG("4 tarefas criadas.")] },
    { id: "bonus-implement", grupo: GB, titulo: "Bônus · Implement", shell: "agente", opcional: true, comando: "/speckit.implement", fim: "bonus",
      saida: [PENSA("Implementando…"), { t: "cria", x: "main.py@metas", verbo: "Update", ms: 500 }, { t: "cria", x: "static/app.js@metas", verbo: "Update", ms: 600 },
        AG("Metas semanais prontas! No app, use ⚙ num hábito para definir a meta (ex.: 3 vezes por semana) e veja \"2 de 3\".")],
      depois: "Abra o app final: a opção de meta semanal já aparece." }
  ];

  // ---------- problemas comuns (prompts da prática · "Quando algo der errado") ----------
  var problemas = {
    "uv": { titulo: "'uv' não é reconhecido", shell: "cmd", gatilho: "uv --version",
      erro: "'uv' não é reconhecido como um comando interno\nou externo, um programa operável ou um arquivo em lotes.",
      causa: "O cmd foi aberto <b>antes</b> da instalação e ainda não enxerga o uv. Feche e abra o cmd. Persistiu? Reinicie a máquina (README, passo 6).",
      modo: "botao", botao: "🔁 Fechar e abrir o cmd",
      saida: [DIM("(novo cmd aberto)"), O(U + "> uv --version"), OK("uv 0.x.y (a1b2c3d4 2026-xx-xx)")] },
    "ssl": { titulo: "Erro de certificado (SSL)", shell: "cmd", gatilho: "uv add fastapi uvicorn",
      erro: "error: Request failed after 3 retries\n  Caused by: invalid peer certificate: UnknownIssuer",
      causa: "A rede da empresa inspeciona o tráfego e o uv não reconhece o certificado. Rode o comando abaixo, abra outro cmd e reabra o agente.",
      comando: "setx UV_NATIVE_TLS true",
      saida: [OK("ÊXITO: o valor especificado foi salvo."), DIM("Abra um cmd novo para a variável valer.")] },
    "429": { titulo: "Erro 429 / rate limit", shell: "agente", gatilho: "/speckit.plan …",
      erro: "Error 429: Rate limit exceeded: free-models-per-day",
      causa: "Limite do modelo gratuito: espere 1 minuto. Sem créditos comprados, são 50 pedidos por dia.",
      modo: "botao", botao: "⏳ Esperar 1 minuto",
      saida: [DIM("(1 minuto depois…)", 900), OK("✓ Pode enviar o prompt de novo.")] },
    "porta": { titulo: "address already in use", shell: "cmd", gatilho: "uv run python main.py",
      erro: "ERROR:    [Errno 10048] error while attempting to bind on address ('127.0.0.1', 8000): address already in use",
      causa: "O app já está rodando em outro cmd: pare com <code>Ctrl+C</code> lá.",
      modo: "botao", botao: "⌨️ Ctrl+C no outro cmd",
      saida: [DIM("INFO:     Shutting down"), OK("✓ Porta 8000 liberada. Rode uv run python main.py de novo.")] },
    "inventou": { titulo: "O agente inventou tecnologia", shell: "agente", gatilho: "/speckit.implement …",
      erro: "● Instalando React e Vite para o frontend…",
      causa: "O agente fugiu do plano. Peça para ele seguir a constituição e o plan.md.",
      comando: "Siga a constituição e o plan.md; desfaça o que não está no plano.",
      saida: [PENSA("Relendo constitution.md e plan.md…"), AG("Você tem razão: o plano pede HTML, CSS e JS puros, sem framework e sem build. Removi React e Vite e voltei ao que está no plan.md.")] }
  };

  window.ROTEIROS = {
    instalacao: instalacao, projeto: projeto, problemas: problemas,
    arquivosIniciais: arquivosIniciais,
    respostasClarify: [["Sequência", RESP_SEQ], ["Arquivar × excluir", RESP_ARQ]]
  };
})();
