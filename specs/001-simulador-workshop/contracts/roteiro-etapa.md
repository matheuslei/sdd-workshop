# Contrato: etapa de roteiro e API do motor

## Etapa
```js
{
  id: "uv",                       // único no simulador
  trilha: "comum"|"opencode"|"claude",
  grupo: "Parte 1 — Instalações", // título de seção (guia e lista lateral)
  titulo: "Instalar o uv",
  shell: "cmd"|"ps"|"agente",     // ⬛ cmd, 🟦 PowerShell, agente (OpenCode/Claude)
  explica: "html curto",          // por que e o que faz
  comando: "texto exato a copiar",
  modo: "exato"|"prefixo"|"bloco"|"livre",
  chaves: ["Invoke-RestMethod", ...],   // modo bloco: linhas obrigatórias
  opcoes: ["Resposta A", ...],          // modo livre: atalhos de resposta
  saida: [ {t:"out"|"ok"|"dim"|"warn"|"agente"|"tool"|"html", x:"...", ms:300} ],
  dicas: [ [/regex/, "mensagem"] ],
  cria: ["caminho@versao"],       // arquivos adicionados à árvore
  opcional: true,                 // pode ser pulada sem afetar a conclusão
  conferir: true,                 // selo "conferir na documentação oficial"
  fim: "abrirApp"|"bonus"         // ação ao concluir
}
```

## Problema comum (`ROTEIROS.problemas[id]`)
```js
{ titulo, shell, erro: "html da mensagem", causa: "texto", comando: "correção", saida: [...] }
```

## API pública (`window.Sim`)
- `Sim.estado()` / `Sim.salvar()` — progresso.
- `Sim.iniciarPagina()` — tema, cabeçalho, navegação.
- `Sim.copiar(texto, botao)`.
- `Sim.ehChaveReal(texto)` → boolean.
- `Sim.terminalGuiado(elemento, { sim:"instalacao"|"projeto", etapas, aoConcluir, aoCriar })`.
- `Sim.arvore(elemento, visualizador)` — renderiza `estado().arquivos`.
- `Sim.etapasDaTrilha(lista)` — filtra por trilha escolhida.
