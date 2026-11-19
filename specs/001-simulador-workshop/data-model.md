# Data Model: Simulador do Workshop SDD

## Progresso (`localStorage["sdd-sim-v1"]`)
```json
{
  "trilha": "opencode" | "claude" | null,
  "tema": "claro" | "escuro" | null,
  "feitas": { "instalacao": ["uv", "python", ...], "projeto": ["p0-cd", "constitution", ...] },
  "arquivos": ["caminho@versao", ...],
  "bonus": false
}
```
- `feitas[sim]` guarda ids de etapas concluídas; trocar de trilha preserva as comuns.
- `arquivos`: chaves de `window.ARQUIVOS` já "criadas" na árvore; a última versão de cada
  caminho é a exibida.
- `bonus`: true após concluir a etapa bônus → o app mostra metas semanais.
- Validação: JSON inválido ou ausente ⇒ estado inicial; storage indisponível ⇒ só memória.

## Etapa (roteiro) — ver [contracts/roteiro-etapa.md](./contracts/roteiro-etapa.md)

## Arquivo simulado (`window.ARQUIVOS`)
- Chave `"caminho@versao"` (ex.: `specs/001-monitor-habitos/spec.md@clarify`) → texto.
- Ordem de exibição por caminho; pastas inferidas pelo `/`.

## Hábito (`localStorage["sdd-sim-v1-habitos"]`)
```json
{ "habitos": [ { "id": "h1", "nome": "Beber água", "arquivado": false,
                 "criado": "2026-11-19", "dias": ["2026-11-18", "2026-11-19"], "meta": null } ] }
```
- `nome`: 1–40 caracteres, sem duplicar (ignorando maiúsculas) entre ativos.
- `dias`: datas `AAAA-MM-DD` ≤ hoje, sem repetição.
- `meta`: `null` (diário) ou 1–7 (só com bônus ativo).
- Transições: ativo ⇄ arquivado (restaurar); excluir remove após `confirm`.
