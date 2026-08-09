# Seldon MCP guide

Seldon exposes its design engine to an external agent over the Model Context
Protocol. The agent discovers, selects, edits, and exports a workspace by
calling tools. Every edit runs through the same safe-apply pipeline the local
editor and `@seldon/ai` use, so an agent can never write a workspace that breaks
core or factory rules.

Read the [host contract](./host-contract.md) first. This guide covers the MCP
server, its deployment scenarios, and the setup for each.

## What the agent gets

The MCP server exposes one tool set, defined once and shared with the in-editor
model. The tools fall into groups:

- Discovery: read the catalog, a board, a node, computed values, and theme
  tokens. These never change the workspace.
- Selection: `select_node`, `select_board`, `set_scope`, and `widen_scope` set
  the target the edit tools act within, the same selection model the editor has.
- Mutation: add, insert, move, duplicate, remove, and set properties. Each
  proposes typed workspace actions validated against a working copy.
- Transactions: `begin_change`, `commit_change`, and `rollback_change` group a
  multi-step edit so it lands as one revision and one undo step.
- Session: `workspace_list`, `workspace_select`, `workspace_create`,
  `get_target_status`, `workspace_export`, `undo`, `redo`,
  `create_checkpoint`, `restore_checkpoint`, and `list_checkpoints`.

A write with no open transaction commits on its own as one revision. A write
inside `begin_change` accumulates until `commit_change`.

## Two layers: host and transport

The server is transport-agnostic. `createSeldonMcpServer(host)` in `@seldon/ai`
builds a server from a host and maps the shared tools onto it. A host owns
workspaces and persistence; the tools do the design work. The caller connects
the server to whatever transport its runtime offers.

There are two hosts:

- `HeadlessHost` (from `@seldon/ai`, re-exported by `@seldon/hari`) runs the
  engine in memory over a file-backed store. No editor is involved. It reads and
  writes the same `.seldon/workspaces` folder the editor uses.
- `BridgeHost` (from `@seldon/foundation`) relays to a live editor tab and falls
  back to a headless host when no tab has the target workspace open.

## Deployment scenarios

| Scenario | Host | Transport | Where it runs | Live editor |
|----------|------|-----------|---------------|-------------|
| Headless CLI | `HeadlessHost` | stdio | `seldon-mcp` bin | no |
| Headless service | `HeadlessHost` | Streamable HTTP | `seldon-mcp --http` | no |
| Editor bridge | `BridgeHost` | Streamable HTTP | editor dev server | yes |

### Headless over stdio

The `seldon-mcp` bin on `@seldon/hari` wires a `HeadlessHost` to stdio. A client
that spawns MCP servers as subprocesses launches it directly.

```bash
seldon-mcp --store ./.seldon/workspaces
```

Flags:

- `--store <dir>`: the workspace store directory. Defaults to
  `.seldon/workspaces`.
- `--workspace <id>`: pin a default target so tool calls can omit
  `targetWorkspaceId`.
- `--export-root <dir>`: the root the factory reads engine assets from during an
  export. Defaults to the working directory.
- `--http`: serve Streamable HTTP instead of stdio.
- `--port <n>`: the HTTP port. Defaults to 7355.

The store starts empty. Call `workspace_create` to make the first workspace, or
point `--store` at a folder the editor already wrote.

### Headless over HTTP

The same bin serves Streamable HTTP on `POST /mcp` with `--http`. Each client
session gets its own server instance, so per-connection selection and
transactions stay isolated.

```bash
seldon-mcp --http --port 7355 --store ./.seldon/workspaces
```

### The editor bridge

The editor dev server mounts `mcpApiPlugin` from `@seldon/foundation/vite`. It serves
the MCP endpoint at `/api/mcp` backed by a `BridgeHost`, plus the bridge's SSE
stream and result endpoints the tab uses. Both apps register it in their
`vite.config.ts` next to the other API plugins.

When a tab has the target workspace open, reads and writes route to it: the tab
reports its current workspace and selection, folds a commit's actions through
its own reducer as one undo step, and steps its own history. The agent edits
exactly what the user sees, and every change lands in the tab's undo stack. With
no tab connected, the same endpoint serves the headless host over the shared
store, so one URL covers both.

Point an MCP client at the running editor:

```
http://localhost:5173/api/mcp
```

## Choosing a target

Tools take an optional `targetWorkspaceId`. When it is omitted the server
resolves the target: a pinned workspace from `workspace_select`, the sole
workspace, or a connected tab. When the choice is ambiguous the tool returns the
candidate ids and asks the agent to pick.

## Undo, redo, and checkpoints

`undo` and `redo` step the target's history. They are global to the workspace,
so with other writers present they may move a change you did not make. The
agent-safe revert is a checkpoint: `create_checkpoint` captures the current
state, and `restore_checkpoint` re-applies it as a new revision, so the restore
is itself undoable.

In the bridge, undo, redo, and checkpoints run against the live tab's history.
In the headless host they run against a bounded in-memory history per workspace.

## Concurrency

Each workspace has its own write queue. A read-modify-write-persist step runs to
completion before the next one starts, so concurrent commits on one workspace
never lose an update. A commit re-applies its actions against the current
workspace rather than the snapshot it opened on, so a change that landed first
is preserved.

## Setup recipes

### Connecting a client

For per-client setup, use the `@seldon/hari` README as the reference. It covers
Cursor, Codex CLI, and Claude Code with verified config snippets:
[../packages/bundles/hari/README.md](../packages/bundles/hari/README.md).

Set this up per project, not globally, so the server runs only where the store
is. Point every client at the same `.seldon/workspaces` directory.

Common gotchas:

- Cursor shows no servers at all. An empty or invalid `~/.cursor/mcp.json` stops
  Cursor from loading every MCP config. Make it `{}` or delete it.
- The `seldon` server is missing from the list. The Customize MCPs page filters
  by a personal-vs-project scope dropdown. Switch it to the project.
- A Cursor stdio entry needs `"type": "stdio"`. Without it the server does not
  load.
- The status reads `disconnected`. That is not an error. It means known but not
  started.
- Use a local Agent chat, not the cloud Agents window. A cloud agent cannot spawn
  a local stdio server.
- Codex config is TOML, not JSON. The table key is `mcp_servers` with an
  underscore.

### An MCP client that spawns a stdio server

Build the packages, then point the client at the bin:

```bash
npm run build:packages
```

Configure the client to run `seldon-mcp --store <project>/.seldon/workspaces`.

### A consumer project on `@seldon/hari`

Install `@seldon/hari`. It ships the `seldon-mcp` bin and re-exports the
`HeadlessHost`, `WorkspaceStore`, and `createSeldonMcpServer` from `@seldon/ai`.
To wire a custom transport, build the server yourself:

```typescript
import { HeadlessHost, createSeldonMcpServer } from "@seldon/hari"

const host = new HeadlessHost({ storeDir: "./.seldon/workspaces" })
const server = createSeldonMcpServer(host)
// Connect `server` to your transport.
```

### The editor bridge in a mounted editor

A project that embeds the editor through `@seldon/foundation` gets the bridge
from the dev-server plugin. Register `mcpApiPlugin({ root })` from
`@seldon/foundation/vite/mcp-api-plugin` in the Vite config alongside
`workspaceApiPlugin`, then open a workspace and point an MCP client at
`/api/mcp`.

### Outside Vite

The host and server are framework-neutral. `createSeldonMcpServer`,
`HeadlessHost`, and `BridgeHost` have no Vite dependency, so any Node server can
mount them. In Next.js, Express, or a plain `http` server, create the host once,
call `createSeldonMcpServer(host)` per session, and hand the request and
response to the MCP SDK's `StreamableHTTPServerTransport`. The `seldon-mcp` bin
in `@seldon/hari` is the reference for the stdio and HTTP wiring. The Vite
plugins in `@seldon/foundation` are the reference for the editor bridge routes.
