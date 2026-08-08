# @seldon/hari

The headless Seldon engine with AI. One install that pulls in `@seldon/terminus`
(engine plus factory) and `@seldon/ai` (local AI orchestration).

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

## Bundles

| Bundle | Pulls in | Choose when |
| --- | --- | --- |
| `@seldon/terminus` | core + factory | Headless load, edit, export. No AI, no editor. |
| `@seldon/hari` | terminus + ai | You also want chat-driven edits from a local model. |
| `@seldon/foundation` | hari + editor | You embed the editor UI, not just the engine. |
