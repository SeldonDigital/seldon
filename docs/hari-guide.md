# @seldon/hari guide

`@seldon/hari` is the headless engine with AI: everything in `@seldon/terminus`
plus `@seldon/ai`. Use it to turn a chat message into workspace changes, then
adopt the result and export it.

Read the [host contract](./host-contract.md) and the
[terminus guide](./terminus-guide.md) first. This guide adds the one function
`@seldon/ai` provides, `chatToActions`, and the way to apply its result.

## Runtime prerequisite

`hari` drives the engine like an editor, but it needs a local model host. Today
that is Ollama. Install and start it, then pull a model:

```bash
ollama serve
ollama pull gpt-oss:20b
```

The `@seldon/ai` package reads `OLLAMA_HOST` and `SELDON_AI_MODEL` from the
environment. See the [ai README](../packages/ai/README.md) for defaults and the
server lifecycle. A hosted MCP path is the planned future integration; Ollama is
the current one.

## The workspace requirement

`ChatToActionsInput.workspace` is mandatory. It is read for context only and is
never mutated. With no editor, the host omits the editor selection hints
(`activeBoardKey`, `selectedNodeId`, `scope`) or sets them itself when it wants
to steer the turn.

## The apply model

A turn mints ids as it works. Adopt `result.workspace` directly with one
`set_workspace` action. Do not re-apply `result.actions`, because re-applying
would re-mint those ids and drop any follow-on edit that targeted them.
`result.actions` is for a change summary or undo grouping. `result.rejected` and
`result.reply` are for reporting.

## A minimal loop

```typescript
import fs from "node:fs"

import { chatToActions, loadWorkspace, workspaceReducer } from "@seldon/hari"

import type { WorkspaceAction } from "@seldon/hari"

let workspace = loadWorkspace(fs.readFileSync("seldon-editor.json", "utf8"))

const result = await chatToActions({
  workspace,
  message: "Make the title use the primary color",
})

// Adopt the workspace the turn built, with one action.
const adopt = {
  type: "set_workspace",
  payload: { workspace: result.workspace },
} as WorkspaceAction
workspace = workspaceReducer(workspace, adopt)

console.log(result.reply)
if (result.rejected.length > 0) {
  console.warn("Rejected:", result.rejected)
}

// Persist the new JSON, or export it with the factory.
fs.writeFileSync("seldon-editor.json", JSON.stringify(workspace, null, 2))
```

From here, export the adopted workspace with `exportWorkspace` or the
`seldon-export` CLI exactly as in the [terminus guide](./terminus-guide.md).

## Status

`@seldon/ai` is in research mode. Treat the entry points, prompts, and model
choice as experiments, not stable API.
