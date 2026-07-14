# Seldon · MCP Server

> **Superseded.** This early draft predates the first-party MCP server and
> is kept as a pointer. The server lives in this repo at
> [`packages/mcp`](./mcp) — see its [README](./mcp/README.md) for how to run
> it and for the details (scope, the 15 tools, the 24-action whitelist, and
> the safety rails).

The design evolved during implementation; where this draft and the shipped
server differ, the server reflects the agreed v1 scope:

- The server lives **in-repo** (`@seldon/mcp`) so it runs Core and Factory
  from source with no version skew.
- Core is exposed through **schema-driven tools** rather than a wrapper per
  helper, so the tool surface stays in sync with Core automatically.
- Persistence is automatic: every accepted batch writes the workspace file
  (atomic write + hash check, external edits win), so no explicit
  `workspace_save` is needed.
- `can_insert` is subsumed by `search_catalog`'s target filter — discovery
  returns only what the reducer will accept.
- Undo/redo, like the rest of the editor shell, doesn't carry over to a
  headless session; session checkpoints and scoped reset actions are the
  analogue.
- The session is **stateful and file-backed** with hash-check optimistic
  concurrency; a storage-adapter layer can slot in behind the same session
  boundary if a second backend ever appears.
- Previews are **first-class**: `view_node` renders real Factory output, so
  reading computed values has visual ground truth.

The foundation of the implementation is this document's central idea: the
editor and the MCP server obey the same contract — hold a workspace,
dispatch typed actions through `workspaceReducer`, read computed values,
never patch state by hand.
