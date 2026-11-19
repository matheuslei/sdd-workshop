# Simulador do Workshop SDD

Um minicurso **no navegador** para acompanhar um workshop de **SDD (Spec-Driven Development) com o GitHub Spec Kit** sem instalar nada.

Em workshops práticos, muita gente perde tempo, ou nem consegue começar, configurando o ambiente: Python, gerenciador de pacotes, Spec Kit, agente de IA, chave de API… Este simulador resolve isso. Quem não conseguiu instalar a tempo, ou ainda não tem experiência, faz o workshop inteiro numa simulação, do primeiro comando de instalação até o app pronto.

> 🔗 **Acesse online:** https://matheuslei.github.io/sdd-workshop/

## O que tem

| Área | O que você faz |
|---|---|
| **Passo 1 · Instalação do ambiente** | Instala uv, Python, Spec Kit e o agente de IA num terminal simulado (⬛ cmd e 🟦 PowerShell do Windows), até criar o projeto. |
| **Passo 2 · Construção do projeto** | Envia os prompts `/speckit.constitution` → `specify` → `clarify` → `plan` → `tasks` → `implement` e vê o agente criar a constituição, a spec, o plano, as tarefas e o código. |
| **Passo 3 · App final** | Usa o **Monitor de hábitos** construído no workshop, funcionando num navegador simulado em `127.0.0.1:8000`. |
| **Guia e prompts** | O passo a passo real de instalação e todos os prompts da prática, com botão Copiar, para repetir tudo na sua máquina depois. |

### Duas trilhas
- **OpenCode + OpenRouter**: o agente OpenCode no terminal, com um modelo gratuito pelo OpenRouter.
- **Claude Code**: o agente é o Claude Code.

Cada trilha tem os seus passos de instalação e reproduz a **interface do agente** escolhido no terminal simulado, de forma ilustrativa.

### Recursos
- **Copiar e colar guiado:** a etapa só avança quando o comando confere. Comandos errados mostram uma dica, por exemplo "esse comando é do PowerShell, mas a etapa é no cmd".
- **Sem travar:** botões "Preencher para mim" e "Executar por mim", e o modo **▶ Assistir**, que executa tudo sozinho.
- **Problemas comuns simulados:** `'uv' não é reconhecido`, erro de certificado (SSL), limite 429 e porta em uso, cada um com a correção.
- **Árvore de arquivos:** acompanhe os arquivos que o agente cria e abra cada um para ler.
- **Funciona no celular:** abas e um botão ▶ Executar no rodapé.
- **Acessível:** navegação por teclado, contraste WCAG AA nos temas claro e escuro, link para pular ao conteúdo e respeito a "reduzir movimento".

## Como usar

**Online:** abra o link do projeto e comece pela página inicial.

**No seu computador:** baixe o repositório e dê **duplo clique em `index.html`**. Funciona sem internet, sem servidor e sem instalar nada (Chrome, Edge ou Firefox atuais).

**Publicar a sua cópia:** em *Settings → Pages* do repositório, escolha *Deploy from a branch*, a branch `main` e a pasta `/ (root)`. O site fica em `https://<seu-usuario>.github.io/<nome-do-repositorio>/`. O arquivo `.nojekyll` faz o GitHub servir os arquivos como estão, sem processamento.

## Privacidade e segurança
- **Nada sai do seu navegador.** O progresso e os hábitos do app ficam só no `localStorage`. Use o botão "Reiniciar" na página inicial para apagar.
- **Nenhuma credencial real.** A simulação usa a chave falsa `sk-or-FALSA-curso-sdd`. Se você colar algo com formato de chave real, o simulador descarta o texto e mostra um alerta.

## Como foi feito

Sem frameworks, sem build e sem dependências externas: só **HTML, CSS e JavaScript**.

O próprio simulador foi desenvolvido com **SDD usando o Spec Kit**, com o Claude Code como agente. Os artefatos estão no repositório:
- `.specify/memory/constitution.md`: os princípios do projeto (offline, fidelidade ao workshop, segurança de credenciais, aprender fazendo, duas trilhas).
- `specs/001-simulador-workshop/`: spec, plano, pesquisa, modelo de dados, contrato, quickstart e tarefas.

### Estrutura
```
index.html                 página inicial: trilha, mapa do curso, progresso
guia/instalacao.html       guia de instalação (gerado dos roteiros)
guia/prompts.html          prompts da prática (gerado dos roteiros)
simulador/instalacao.html  Passo 1 · terminal guiado
simulador/projeto.html     Passo 2 · agente + árvore de arquivos
simulador/app-final.html   Passo 3 · Monitor de hábitos
assets/sim.js              motor: terminal, interfaces dos agentes, progresso, acessibilidade
assets/sim.css             estilos e temas claro/escuro
assets/roteiros.js         dados das etapas (comandos, saídas, dicas) de cada trilha
assets/projeto-arquivos.js conteúdo dos arquivos "gerados" pelo agente
assets/habitos-app.js      o Monitor de hábitos
```

### Para quem for manter
- **Comandos, prompts e saídas** ficam em `assets/roteiros.js`. As páginas de guia e de prompts são geradas a partir dele.
- **O conteúdo dos arquivos que o agente "cria"** fica em `assets/projeto-arquivos.js`.
- **Os passos da trilha Claude Code** não fazem parte do material original do workshop. Por isso trazem o selo "conferir na documentação oficial".
- **Para testar:** siga `specs/001-simulador-workshop/quickstart.md`.

## Avisos
- **É uma simulação didática.** As saídas e as interfaces são **ilustrativas** (versões aparecem como `0.x.y`) e podem diferir das ferramentas reais, que mudam com frequência. Confira sempre a documentação oficial.
- **Não é oficial:** este projeto não tem vínculo com GitHub, Anthropic, OpenCode ou OpenRouter. Os nomes são citados só para identificar as ferramentas usadas no workshop.
- **Material em revisão:** o conteúdo é um material didático em construção. Revise antes de usar com uma turma.

## Licença
_(defina a licença antes de publicar, por exemplo MIT para o código)_
