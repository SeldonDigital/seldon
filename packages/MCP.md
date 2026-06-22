# Seldon · MCP Server

This guide shows how to wire an MCP server to `@seldon/core`. The server lets an AI client load a workspace, change it through actions, read computed values, and export code. It does everything the editor does without the browser UI.

Core owns design state and rules. The editor adds gestures, history, selection, and local storage on top of Core. An MCP server replaces the editor shell with server-side state and exposes Core through MCP tools.

---

## The Contract

The editor and an MCP server follow the same contract. Both hold a **workspace** object in memory, send typed **actions** to change it, read **computed** values for display, and serialize the result to JSON. Neither patches workspace maps by hand outside the reducer.

This means an MCP server is a headless editor. It imports the same Core entry points the editor imports. It does not fork or reimplement any design logic.

```mermaid
flowchart TD
  client[MCP client] -->|tool call| server[MCP server]
  server --> reducer[workspaceReducer]
  reducer -->|throws| error[Validation error, no change]
  reducer -->|returns workspace| history[Push to history]
  history --> store[Storage adapter]
  server --> compute[Compute selectors]
  server --> export[Factory export]
```

---

## What Core Provides

The MCP server wraps these Core entry points directly. None of them require a browser.

| Capability | Core entry point | Module |
| --- | --- | --- |
| Create a workspace | `createEmptyWorkspace` | `@seldon/core` |
| Apply one action | `workspaceReducer` | `@seldon/core/workspace/reducers/reducer` |
| Apply a batch of actions | `applyActions` | `@seldon/core/workspace/reducers/apply-actions` |
| Action contract | `WorkspaceAction` | `workspace/reducers/types.ts` |
| Read computed node values | `computeNodeProperties` | `@seldon/core/workspace/compute` |
| Read computed themes | `getComputedTheme`, `computeWorkspaceThemes` | `@seldon/core/workspace/compute` |
| Validate an insertion | `validateComponentInsertionForUI` | `workspace/reducers/helpers/validation` |
| Read a schema | `getComponentSchema` | `@seldon/core/components/catalog` |
| Export code and assets | `exportWorkspace` | `@seldon/factory/export/export-workspace` |

---

## What The Server Owns

The editor keeps a few runtime concerns that Core does not. The MCP server must provide its own version of each one.

| Concern | Editor source | Server replacement |
| --- | --- | --- |
| Persistence | IndexedDB through `idb-keyval` | File, database, or in-memory store |
| Undo and redo | History snapshot stack | Snapshot array per session |
| Selection | Active board, node, and theme | Explicit ids on each tool call |
| Preview | Transient workspace | Optional, usually skip |

Reducers return a new workspace object on each call. A history stack is a plain array of those snapshots.

---

## Runtime

Run the server under Node or Bun. Core depends on `immer` and `chroma-js`. It does not run in a plain browser context here.

React is a peer dependency. Editing and compute do not need React. Pull React in only when the server renders CSS through Factory helpers.

---

### Local Packages

`@seldon/core` and `@seldon/factory` are private workspace packages. They are not on a registry. The repo links them through npm workspaces with `file:` paths.

Both ship TypeScript source. `@seldon/core` resolves to source under the `development` export condition and to `./dist/index.js` otherwise. `@seldon/factory` ships source only and has no build. Run the server from source with a TypeScript runtime.

The simplest setup adds the server as a workspace in this repo:

1. Create a folder such as `packages/mcp` and add it to `workspaces` in the root `package.json`.
2. Depend on the packages with `file:` paths.
3. Run `npm install` at the repo root to symlink them into `node_modules`.

```json
{
  "name": "@seldon/mcp",
  "dependencies": {
    "@seldon/core": "file:../core",
    "@seldon/factory": "file:../factory"
  }
}
```

Start the server with a TypeScript runtime and the `development` condition so Core resolves to source:

```bash
# Bun
bun --conditions=development src/mcp-server.ts

# Node
node --import tsx --conditions=development src/mcp-server.ts
```

Without `--conditions=development`, Node picks `./dist/index.js` for Core and the import fails until you build Core. Factory has no build, so the TypeScript runtime stays required either way.

Import Factory through its deep paths. It exposes no root entry. Use `@seldon/factory/export/export-workspace`, not `@seldon/factory`.

---

**IMPORTANT NOTE:** To keep the server out of version control, put it outside this repo and point its `file:` paths at absolute package locations. An in-repo `packages/mcp` cannot be fully local, because adding it to `workspaces` edits the tracked root `package.json`.

---

## Tool Surface

You do not need one tool per action. Two layers cover every editor capability.

### Edit tool

Every editor gesture is one `WorkspaceAction`. A single `apply_actions` tool covers all of them.

```typescript
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"

type ApplyActionsInput = {
  actions: WorkspaceAction[]
}

function applyActionsTool(session: Session, input: ApplyActionsInput) {
  try {
    const next = applyActions(session.workspace, input.actions)
    session.history.push(session.workspace)
    session.workspace = next
    return { ok: true, workspace: next }
  } catch (error) {
    // A WorkspaceValidationError leaves state unchanged.
    return { ok: false, error: String(error) }
  }
}
```

This mirrors the editor dispatch loop. Validation and verification run inside the reducer, so the server gets the same safety the editor gets. A rejected action throws before state changes.

For ergonomics, add thin typed wrappers such as `add_component`, `set_node_properties`, `insert_default_instance`, and `set_theme_override`. Each wrapper builds one action payload and calls the same reducer.

### Lifecycle tools

| Tool | Maps to |
| --- | --- |
| `workspace_create` | `createEmptyWorkspace` |
| `workspace_open` | storage adapter, then `set_workspace` action |
| `workspace_save` | storage adapter |
| `workspace_export` | `exportWorkspace` |
| `undo` and `redo` | history stack |

Load and import flows run the loaded JSON through `set_workspace` so migration can upgrade `metadata.version` and verification can check integrity.

### Read tools

These tools let the client see what the editor panels show.

| Tool | Maps to |
| --- | --- |
| `get_workspace` | raw workspace JSON |
| `get_computed_node` | `computeNodeProperties` |
| `get_computed_theme` | `getComputedTheme` |
| `list_catalog` | catalog exports |
| `get_schema` | `getComponentSchema` |
| `can_insert` | `validateComponentInsertionForUI` |

The workspace file stores overrides and templates only. Use the compute tools when the client needs the values that should render on screen.

---

## Action Input Schema

The `apply_actions` tool needs a schema for its `actions` argument. Core can generate one from the action union.

```bash
cd packages/core
npm run generate:action-schema
```

This writes `workspace/reducers/workspace-action-schema.json` from the `WorkspaceAction` type. Use that JSON Schema as the tool input schema.

Important: the generated file is a permissive placeholder until the schema generator runs on a clean typecheck. Until then, hand-author input schemas for the common actions you expose.

---

## Session Model

Choose one of two models.

- **Stateful session.** Keep `currentWorkspace` and `history` per session, the way the editor keeps one open workspace. Tools take ids and act on the held workspace.
- **Stateless calls.** Each tool takes and returns the full workspace JSON. This is simpler but sends larger payloads.

A stateful session matches the editor model and keeps undo and redo cheap.

```typescript
type Session = {
  workspace: Workspace
  history: Workspace[]
}
```

Drop selection state. Pass `nodeId`, `boardId`, and `themeId` directly on each tool call instead of tracking an active target.

---

## From Workspace To Code

The server produces a valid workspace. Factory turns that workspace into files.

1. Finish editing through `apply_actions`.
2. Run compute so inheritance, themes, and computed cells resolve.
3. Call `exportWorkspace` with target options such as React plus CSS.

```typescript
import { exportWorkspace } from "@seldon/factory/export/export-workspace"

const files = await exportWorkspace(session.workspace, {
  rootDirectory: "/path/to/project",
  target: { framework: "react", styles: "css-properties" },
  output: {
    componentsFolder: "/src/components",
    assetsFolder: "/public/assets",
    assetPublicPath: "/assets",
  },
})
```

---

## Further Reading

| Topic | Document |
| --- | --- |
| Core | [core/README.md](./core/README.md) |
| Editor | [editor/README.md](./editor/README.md) |
| Reducer actions | [core/workspace/reducers/README.md](./core/workspace/reducers/README.md) |
| Workspace compute | [core/workspace/compute/README.md](./core/workspace/compute/README.md) |
| Workspace file spec | [core/workspace/WORKSPACE.md](./core/workspace/WORKSPACE.md) |
| Factory | [factory/README.md](./factory/README.md) |
| Vocabulary | [GLOSSARY.md](../GLOSSARY.md) |
