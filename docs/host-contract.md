# Host contract

`@seldon/terminus` and `@seldon/hari` run inside a consumer app with no Seldon
editor. This doc is the contract a host follows to drive the engine the way the
editor does. Both bundle READMEs link here instead of repeating it.

## The workspace is the state

A `Workspace` is a plain serializable object. The host owns reading and writing
its JSON. Get one in one of two ways:

```typescript
import { createEmptyWorkspace, loadWorkspace } from "@seldon/terminus"

const fromFile = loadWorkspace(jsonString)
const fresh = createEmptyWorkspace()
```

`loadWorkspace(json)` parses and migrates the file, so an older file upgrades on
read. It also restores each node `id` from its map key, which a plain
`JSON.parse` does not. Always read a workspace file through `loadWorkspace`.

Where the JSON comes from: the Seldon editor's "Save Workspace with Components"
writes it, or the host builds one from `createEmptyWorkspace` and actions.

## Change it only through actions

You never patch the workspace maps by hand. Every change is one typed
`WorkspaceAction`, a `type` and a `payload`. Apply actions through the reducer.

```typescript
import { applyActions, workspaceReducer } from "@seldon/terminus"

import type { Workspace, WorkspaceAction } from "@seldon/terminus"

// One action at a time.
const next: Workspace = workspaceReducer(current, action)

// Or a batch, folded in order.
const result: Workspace = applyActions(current, actions)
```

The reducer validates each action. An invalid action is rejected and leaves the
workspace unchanged, so a bad action never corrupts state. Verification runs
after each action and rejects a result with a dangling or duplicate reference.

## Persist and export

The host writes the current workspace back to JSON when it wants to save. To turn
the workspace into framework code, hand it to the factory. See the
[terminus guide](./terminus-guide.md) for the export call and the
[factory README](../packages/factory/README.md) for options and the CLI.

## Summary

1. Load or create a `Workspace`.
2. Build `WorkspaceAction`s from your own code or UI.
3. Apply them through `workspaceReducer` or `applyActions`.
4. Keep the returned workspace as the current snapshot.
5. Save the JSON, export it, or both.
