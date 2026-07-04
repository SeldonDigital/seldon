# Seldon · AI

`@seldon/ai` turns a chat message into a list of workspace actions. It runs a
local model through Ollama, so nothing leaves the machine. The model never edits
the workspace file. It returns `WorkspaceAction[]`, and the editor applies them
through the same reducer every gesture uses.

## What it does

`chatToActions` builds a compact grounding summary from the workspace, sends it
with the user's request to a local Ollama model, and parses a schema-constrained
JSON response into actions.

```typescript
import { chatToActions } from "@seldon/ai"

const { actions, reply } = await chatToActions({
  workspace,
  message: "Make the title use the primary color",
  activeBoardKey,
})
```

The result is single-shot. It does not run a multi-turn tool loop yet.

## Grounding

`build-context.ts` emits a small summary, not the full file. It lists the
component boards, the active board's node tree with ids to target, the theme
ids, and the component catalog ids. The model needs identity and structure, not
every property override.

## Local model

The client calls `http://127.0.0.1:11434/api/chat` with `stream: false` and a
`format` JSON Schema that constrains the decode.

- Install Ollama and pull a tool or JSON capable model, for example `qwen3`.
- Override the model with the `SELDON_AI_MODEL` env var.
- Override the host with the `OLLAMA_HOST` env var.

## Action set

The agent may emit a curated subset of `WorkspaceAction`. See
`schema/action-schema.ts` for the list and `prompt/system-prompt.ts` for the
payload shapes the model is told to produce. The reducer validates payloads when
the editor applies them, so an invalid action is rejected without changing state.
