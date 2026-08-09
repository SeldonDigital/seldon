# @seldon/hari

The headless Seldon engine with AI. One install that pulls in the workspace
engine (`@seldon/core`), the export factory (`@seldon/factory`), and local AI
orchestration (`@seldon/ai`).

Choose `hari` when a consumer app wants chat-driven edits on top of the headless
load, edit, and export flow. It needs a local model host.

```bash
npm install @seldon/hari
```

```typescript
import { chatToActions, loadWorkspace, workspaceReducer } from "@seldon/hari"
```

- Load, chat, adopt, and export loop: [../../../docs/hari-guide.md](../../../docs/hari-guide.md)
- How a host drives the engine: [../../../docs/host-contract.md](../../../docs/host-contract.md)
- Local model setup and AI status: [../../ai/README.md](../../ai/README.md)

## MCP quickstart

`hari` ships the `seldon-mcp` bin. It serves a project's workspace store to an MCP
client such as Cursor, so an agent can read and edit the design through Seldon's
core and factory.

From your project root:

```bash
npm install @seldon/hari
npx seldon-mcp init
```

`init` does three things:

- Creates the store directory `.seldon/workspaces`.
- Adds a `seldon` server to `.cursor/mcp.json` and keeps any other servers.
- Seeds one starter workspace named after your project when the store is empty.

Reload Cursor, or open Settings > MCP and enable the `seldon` server. Then ask
your agent to list workspaces and edit the seeded one.

Options:

- `npx seldon-mcp init --store <dir>` picks a different store directory.
- `npx seldon-mcp init --source <file>` seeds from an existing workspace file
  instead of a blank one.

To run the server by hand instead of letting the client spawn it:

```bash
seldon-mcp --store .seldon/workspaces            # stdio
seldon-mcp --store .seldon/workspaces --http     # POST /mcp on port 7355
seldon-mcp --store .seldon/workspaces --workspace .seldon/source.json
```

`--workspace <file>` imports a raw workspace file into the store once on startup.

## The store and the editor

The MCP server and the editor share one store, the `.seldon/workspaces` directory.
Each workspace is one `<id>.json` file, and the directory listing is the index.
Point the editor's workspace API and `seldon-mcp` at the same directory and both
see the same records.

A file such as `project.react.json` under `.seldon` is an export artifact, not a
store record. Do not point `--store` at it.

## Troubleshooting

- The agent reports no workspaces. Run `npx seldon-mcp init`, or ask it to call
  `workspace_create`.
- The `seldon` server is missing. Reload Cursor after `init`, and check that
  `.cursor/mcp.json` has a `seldon` entry under `mcpServers`.

## Bundles

| Bundle | Pulls in | Choose when |
| --- | --- | --- |
| `@seldon/terminus` | core + factory | Headless load, edit, export. No AI, no editor. |
| `@seldon/hari` | core + factory + ai | You also want chat-driven edits from a local model. |
| `@seldon/foundation` | hari + editor | You embed the editor UI, not just the engine. |
