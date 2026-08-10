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

## Connect an AI client

`hari` ships the `seldon-mcp` bin. It serves a project's workspace store to an MCP
client such as Cursor, Codex CLI, or Claude Code, so an agent reads and edits the
design through Seldon's core and factory.

Set this up per project, not globally, so the server only runs where the store
lives. Point every client at the same store directory, `.seldon/workspaces`.

### Cursor quickstart

From your project root:

```bash
npm install @seldon/hari
npx seldon-mcp init
```

`init` does three things:

- Creates the store directory `.seldon/workspaces`.
- Adds a `seldon` server to `.cursor/mcp.json` and keeps any other servers.
- Seeds one starter workspace named after your project when the store is empty.

Reload Cursor. Open Settings, then MCP, switch the scope to this project, and
enable the `seldon` server. Ask your agent to list workspaces and edit the seeded
one.

Options:

- `npx seldon-mcp init --store <dir>` picks a different store directory.
- `npx seldon-mcp init --source <file>` seeds from an existing workspace file
  instead of a blank one.

### Cursor manual config

To write the config yourself, add a project-scoped `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "seldon": {
      "type": "stdio",
      "command": "npx",
      "args": ["seldon-mcp", "--store", "${workspaceFolder}/.seldon/workspaces"]
    }
  }
}
```

`"type": "stdio"` is required. Without it Cursor does not load the server.
`${workspaceFolder}` is the folder that holds `.cursor/mcp.json`, so the store
path stays correct no matter where the server spawns.

### Codex CLI

Codex reads TOML, not JSON. Add the server to the user config at
`~/.codex/config.toml`, or to a trusted project config at `.codex/config.toml`:

```toml
[mcp_servers.seldon]
command = "npx"
args = ["seldon-mcp", "--store", ".seldon/workspaces"]
```

Or run `codex mcp add seldon -- npx seldon-mcp --store .seldon/workspaces`. The
table key is `mcp_servers` with an underscore. A relative `--store` resolves
against the directory where `codex` runs.

### Claude Code

Add a project-scoped `.mcp.json` at the project root:

```json
{
  "mcpServers": {
    "seldon": {
      "command": "npx",
      "args": ["seldon-mcp", "--store", ".seldon/workspaces"]
    }
  }
}
```

Or run
`claude mcp add --scope project --transport stdio seldon -- npx seldon-mcp --store .seldon/workspaces`.
Claude Code asks to approve a project server on first use. Manage servers with
`/mcp`. Reset approvals with `claude mcp reset-project-choices`.

### Project scope vs global scope

Prefer project scope so the server runs only where the store is. Use a global
config, such as `~/.cursor/mcp.json`, only when you want the server everywhere.
In Cursor a project entry wins over a global entry with the same name, with no
merge.

## Run the server by hand

To run the server yourself instead of letting the client spawn it:

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

The editor serves this store only when it runs at the project root. Opening a
file in the editor imports it into the current store. It does not switch which
store the editor serves.

A file such as `project.react.json` under `.seldon` is an export artifact, not a
store record. Do not point `--store` at it.

## Troubleshooting

- Cursor shows no servers at all. An empty or invalid `~/.cursor/mcp.json` stops
  Cursor from loading every MCP config. Make it `{}` or delete it.
- The `seldon` server is missing from the list. The Customize MCPs page filters
  by a personal-vs-project scope dropdown. Switch it to this project. The
  marketplace Browse view is a different list.
- The status reads `disconnected`. That is not an error. It means known but not
  started. Enable the server or use it once.
- Use a local Agent chat, not the cloud Agents window. A cloud agent cannot spawn
  a local stdio server.
- To see errors in Cursor, open the Output panel and pick the MCP Logs channel.
- `npx seldon-mcp` must resolve. Install `@seldon/hari` in the project. Otherwise
  point `command` at `node` and `args` at
  `./node_modules/@seldon/hari/dist/bin/seldon-mcp.js`.
- Codex config is TOML. Pasting Cursor or Claude JSON will not work.
- The agent reports no workspaces. Run `npx seldon-mcp init`, or ask it to call
  `workspace_create`.

## Bundles

| Bundle | Pulls in | Choose when |
| --- | --- | --- |
| `@seldon/terminus` | core + factory | Headless load, edit, export. No AI, no editor. |
| `@seldon/hari` | core + factory + ai | You also want chat-driven edits from a local model. |
| `@seldon/foundation` | hari + editor | You embed the editor UI, not just the engine. |
