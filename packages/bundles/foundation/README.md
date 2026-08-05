# @seldon/foundation

The full Seldon platform. One install that pulls in `@seldon/hari` (engine plus
AI) and the embeddable editor library (`@seldon/editor`).

Choose `foundation` when a consumer app embeds the editor, not just the headless
engine. It ships as source and is compiled by the consumer's bundler, so use it
from a bundler-based app (Vite, Next), not a plain Node script.

```bash
npm install @seldon/foundation
```

```typescript
import { loadWorkspace, chatToActions } from "@seldon/foundation"
```

For the headless engine without the editor UI, use `@seldon/terminus` or
`@seldon/hari` instead. They run under plain Node.

- How a host drives the engine: [../../../docs/host-contract.md](../../../docs/host-contract.md)
- Embeddable editor library: [../../editor/shared/README.md](../../editor/shared/README.md)

## Bundles

| Bundle | Pulls in | Choose when |
| --- | --- | --- |
| `@seldon/terminus` | core + factory | Headless load, edit, export. No AI, no editor. |
| `@seldon/hari` | terminus + ai | You also want chat-driven edits from a local model. |
| `@seldon/foundation` | hari + editor | You embed the editor UI, not just the engine. |
