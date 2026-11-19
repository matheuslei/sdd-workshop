<!--
Sync Impact Report
- Version change: 1.0.1 → 1.0.2 (PATCH: material do workshop movido para _local/material-workshop/,
  fora do repositório; README.md passa a apresentar o projeto)
- Principles: I. Offline e sem dependências; II. Fidelidade ao workshop; III. Segurança de
  credenciais; IV. Aprender fazendo, para iniciantes; V. Duas trilhas, uma base
- Added sections: Restrições do projeto; Fluxo de trabalho e critérios de pronto; Governance
- Removed sections: nenhuma
- Templates: plan/spec/tasks-template.md lidos em tempo de execução; nenhuma alteração necessária
- Follow-up TODOs: nenhum
-->
# Simulador do Workshop SDD Constitution

## Core Principles

### I. Offline e sem dependências

- O simulador MUST abrir com duplo clique em `index.html` (protocolo `file://`), sem servidor.
- O código MUST usar apenas HTML, CSS e JavaScript clássico (`<script src>`, sem módulos ES),
  sem framework, etapa de build, CDN, fontes ou imagens externas.
- Nenhuma página MUST fazer requisição de rede.

Motivo: o simulador existe justamente para quem não conseguiu instalar nada; ele não pode
exigir instalação.

### II. Fidelidade ao workshop

- O material original do workshop é a fonte da verdade: `_local/material-workshop/guia-instalacao.md` (instalação) e
  `_local/material-workshop/prompts-pratica.md` (prática). Ele fica só na máquina local (`_local/` está no `.gitignore`).
  Comandos e prompts exibidos MUST ser idênticos a esses arquivos.
- Comandos da trilha Claude Code que não estão nesses arquivos MUST ser marcados como
  "conferir na documentação oficial".
- Toda saída de terminal e toda resposta de agente MUST trazer o selo "saída ilustrativa".
  Versões aparecem genéricas (ex.: `0.x.y`) quando o original não define.
- Se a fonte mudar, o roteiro do simulador MUST ser atualizado na mesma alteração.

### III. Segurança de credenciais (NÃO NEGOCIÁVEL)

- O simulador MUST NOT pedir, guardar nem transmitir chave, senha ou token real.
- Chaves de exemplo MUST ser obviamente falsas (`sk-or-FALSA-...`).
- Texto colado com formato de chave real (ex.: `sk-or-v1-` + 64 hex, `sk-ant-...`) MUST
  disparar um alerta educativo e ser descartado: não vai para tela, histórico nem storage.
- Nenhum dado sai do navegador.

### IV. Aprender fazendo, para iniciantes

- Cada etapa mostra o comando com botão Copiar; o aluno cola no terminal simulado e a etapa
  só avança quando o comando corresponde ao esperado.
- Erros comuns (terminal errado, comando incompleto, digitação) MUST gerar dica específica.
- Todo texto em pt-BR, sem jargão sem explicação; cada etapa indica ⬛ cmd ou 🟦 PowerShell.
- Deve existir saída de emergência ("Mostrar resposta"/"Pular") para ninguém ficar travado.

### V. Duas trilhas, uma base

- O aluno escolhe a trilha OpenCode + OpenRouter ou Claude Code; a escolha fica salva e
  pode ser trocada a qualquer momento.
- Etapas MUST ser dados (arquivo de roteiro), não código espalhado em páginas.
- Componentes (terminal, árvore de arquivos, progresso, tema) ficam em `assets/` e são
  compartilhados; página nova não duplica lógica.

## Restrições do projeto

- Progresso e dados do app final apenas no `localStorage`, com opção de reiniciar.
- Acessível: navegável por teclado, contraste adequado, tema claro/escuro, legível em 375px.
- Sem git nem remoto; criar backup `.zip` antes de sobrescrever arquivos existentes.
- Todo o conteúdo é rascunho didático sujeito a revisão humana antes de uso com alunos.
- Sem dados pessoais: exemplos usam nomes e caminhos genéricos (`<seu-usuario>`, `aluno`).

## Fluxo de trabalho e critérios de pronto

- Mudanças seguem o fluxo Spec Kit: specify → (clarify) → plan → tasks → implement.
- Pronto significa:
  - console do navegador sem erros em todas as páginas;
  - as duas trilhas concluíveis do início ao fim só colando os comandos da fonte;
  - o app final (Monitor de hábitos) funcional e com estado mantido após recarregar;
  - todos os links internos funcionam via `file://`.

## Governance

Esta constituição prevalece sobre outras práticas do projeto. Alterações exigem atualizar
este arquivo com Sync Impact Report e versão semântica (MAJOR: remover/redefinir princípio;
MINOR: novo princípio ou seção; PATCH: redação). Todo plano (`plan.md`) MUST conter a
checagem de conformidade com os princípios I–V; exceções exigem justificativa registrada na
seção de complexidade do plano.

**Version**: 1.0.2 | **Ratified**: 2026-11-19 | **Last Amended**: 2026-11-19
