# @seldon/mcp — Seldon MCP Server

A standalone, file-backed stdio MCP server that makes AI agents first-class
clients of the Seldon design engine: open a workspace file, mutate it through
Core's validated actions, verify the result visually, and export production
React + CSS safely. This README covers running it.

## Launch

The server runs Core/Factory from TypeScript source, so it needs a TS runtime
(`tsx`) with the `development` export condition, on **Node 22**. From inside
the repo:

```sh
npm start --workspace @seldon/mcp -- --root /path/to/your/project
```

MCP clients spawn servers from arbitrary working directories, so client
configs must use absolute paths (a bare `--import tsx` resolves against the
spawn cwd and breaks):

```sh
node \
  --import /ABS/PATH/TO/seldon/node_modules/tsx/dist/loader.mjs \
  --conditions=development \
  /ABS/PATH/TO/seldon/packages/mcp/src/main.ts \
  --root /path/to/your/project
```

For Claude Code:

```sh
claude mcp add seldon -- node \
  --import /ABS/PATH/TO/seldon/node_modules/tsx/dist/loader.mjs \
  --conditions=development \
  /ABS/PATH/TO/seldon/packages/mcp/src/main.ts \
  --root "$PWD"
```

### Roots

`--root <path>` (repeatable, or the `SELDON_MCP_ROOTS` env var,
path-delimiter-separated) bounds every workspace and export path the model
may touch. Roots are server configuration — the model can never change them.
Default: the working directory.

## Optional dependencies

Both are declared as `optionalDependencies`; the server degrades cleanly
without them.

| Dependency | Enables | Without it |
| --- | --- | --- |
| `@huggingface/transformers` | Semantic catalog search (local ONNX embeddings; no network, no keys) | Keyword + synonym search only |
| `playwright` (+ `npx playwright install chromium`) | `view_node` / `apply_actions` PNG screenshots | `image` requests degrade to `html` |

## Semantic search index

The index is built at build time over the packaged catalog and checked
against the embedding model identity at load (a mismatch falls back to
keyword search, loudly):

```sh
npm run build:icon-tags --workspace @seldon/mcp      # curated icon vocabulary
npm run build:search-index --workspace @seldon/mcp   # embeds the catalog → search-index/
```

## The 15 tools

One write path, schema-driven discovery, computed reads, visual ground
truth, safe export:

- **Session** — `workspace_open`, `workspace_info`, `checkpoint` (in-memory
  snapshots; restore writes through the concurrency check)
- **Write** — `apply_actions` (24 whitelisted action types, all-or-nothing
  batches, diff-derived receipts, optional post-edit render)
- **Read** — `get_workspace_outline`, `get_node` (raw/computed),
  `find_nodes`, `get_computed_theme`
- **Discovery** — `list_catalog`, `search_catalog`, `get_component_schema`,
  `get_property_schema`, `get_action_schema`
- **Output** — `view_node` (css/html/image; the preview IS production
  output), `workspace_export` (dry-run, `@seldon-generated` markers,
  manifest, conflict skipping, orphan reporting)

Every accepted batch auto-persists the workspace file (atomic write + hash
check; external edits win and are never clobbered). Credentials and
`__editor` fields never appear in tool output; workspace-authored free text
is returned in a `{"$userText": ...}` envelope.

## Known limitations (v1)

- `view_node` renders the normal interaction state only; there is no
  hover/focus/pressed state strip. State *values* are still verifiable via
  `get_node` with mode "computed".
- The `css` format returns resolved values only, not the generated CSS
  text. The full generated stylesheet is available inlined in the `html`
  format, or on disk via `workspace_export`.

## Files the server writes next to the workspace

- `.seldon/mcp-log.jsonl` — structured observability log (every tool call,
  rejection, schema bounce, no-op flag, zero-result search). No rotation.
- `.seldon/previews/*.png` — every image render, for humans to open.

## Tests

Run with Node 22 (shell Node 20 breaks vitest):

```sh
PATH="$HOME/.volta/bin:$PATH" npm test --workspace @seldon/mcp
```

The suite includes six end-to-end acceptance journeys run as a scripted MCP
client against the real server (`src/transcripts.test.ts`).
