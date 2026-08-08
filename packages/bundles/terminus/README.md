# @seldon/terminus

The headless Seldon engine. One install that pulls in the workspace engine
(`@seldon/core`) and the export factory (`@seldon/factory`).

Choose `terminus` when a consumer app loads, edits, and exports a Seldon
workspace with no editor and no AI.

```bash
npm install @seldon/terminus
```

```typescript
import { exportWorkspace, loadWorkspace, workspaceReducer } from "@seldon/terminus"
```

- Load, edit, and export flow: [../../../docs/terminus-guide.md](../../../docs/terminus-guide.md)
- How a host drives the engine: [../../../docs/host-contract.md](../../../docs/host-contract.md)
- Export options and the `seldon-export` CLI: [../../factory/README.md](../../factory/README.md)

## Bundles

| Bundle | Pulls in | Choose when |
| --- | --- | --- |
| `@seldon/terminus` | core + factory | Headless load, edit, export. No AI, no editor. |
| `@seldon/hari` | terminus + ai | You also want chat-driven edits from a local model. |
| `@seldon/foundation` | hari + editor | You embed the editor UI, not just the engine. |
