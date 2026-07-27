# Seldon · Editor (React)

`@seldon/editor-react` is the React build of the Seldon design client. It runs in the browser, edits a Seldon workspace, and turns each gesture into a typed **action** that flows through the same Core reducer an AI agent would use.

This app owns the React interface: components, hooks, and runtime state. It imports the platform-neutral logic, dev-server plugins, and static assets from `@seldon/editor`. The Vue build in `@seldon/editor-vue` mirrors this app one to one. Read the shared contract in [../editor/README.md](../editor/README.md) first.

---

## Stack

- **Vite 8** with **React 19**. The app is a single-page client. `src/main.tsx` mounts a `react-router` browser router with two routes: `/` for the home page and `/:id` for the editor. The editor route is lazy-loaded behind `Suspense`.
- **Zustand** holds runtime state. There is no Redux or React context store.
- **framer-motion** drives window and panel animation. **allotment** handles resizable panes. **react-zoom-pan-pinch** drives canvas zoom and pan. **@atlaskit/pragmatic-drag-and-drop** drives tree and canvas drag.
- The workspace store is the shared filesystem store served at `/api/workspaces`, so a workspace saved here opens in the Vue editor. See [../editor/README.md](../editor/README.md).
- Imports use path aliases: `@app` for `app/`, `@seldon/components` for `seldon/`, and `@seldon/editor` for the shared package, alongside `@seldon/core`, `@seldon/factory`, and `@seldon/ai`.

### Run steps

- `npm run dev` copies font licenses and font files, ensures a local Ollama server for the AI agent through `scripts/ensure-ollama.mjs`, then starts Vite on port 5173.
- `npm run build` builds the production bundle. `npm run build:release` generates third-party notices first. `npm start` serves the build with `vite preview`.
- `npm run quality` type-checks with `tsc`. `npm run lint` runs ESLint. `npm run export:seldon` regenerates the `seldon/` components.

---

## Layout

### `src/`

`src/main.tsx` is the entry. It mounts the router and configures the shared workspace store as the React editor.

### `app/` — the React interface

| Area | Role |
| --- | --- |
| `editor/` | Editor page, providers, project init, and editor stores |
| `canvas/` | Canvas surface, node rendering, and per-node CSS |
| `sidebars/` | Objects sidebar and properties sidebar |
| `topbar/` | Menus and tools |
| `dialogs/` | Catalog inserts, component create and export, image upload |
| `menus/` | Combobox and context menus, draggable window view-model |
| `windows/` | Window surface chrome |
| `palettes/` | The Hari AI chat surface |
| `tracking/` | Hover and selection indicators |
| `focus/`, `toaster/` | Focus ring and toasts |
| `persistence/`, `project/` | Autosave and active workspace state |
| `workspace/`, `commands/` | Workspace hooks and gesture commands |
| `themes/`, `icons/`, `fonts/` | Theme, icon, and font view-models |
| `io/`, `home/`, `overlays/`, `views/` | Import and export, home page, overlays, screen views |

### `seldon/` — generated View library

`seldon/` holds the generated design components the app binds to. Raw markup comes from `seldon/native-react/`. These files are generated, so do not hand-edit them. Regenerate with `npm run export:seldon`. See [seldon/README.md](./seldon/README.md) for component usage.

### `scripts/`

Font copy, Ollama ensure, third-party notices, `seldon/` export, and app import normalization.

---

## MVVM In React

The app follows the editor MVVM layering from [../editor/README.md](../editor/README.md). In React:

- **View**: generated `.tsx` components in `seldon/`, plus editor chrome views. A View binds named values and renders element tags. It computes nothing.
- **ViewModel**: `use-*.ts` hooks. Some controller components act as view-models. A view-model owns UI state, derives display values, wires commands, and assembles the props the View binds to.
- **Model**: `@seldon/core` services and the shared `@seldon/editor` lib.

### View rules

- Compute nothing inside returned JSX. No ternaries, `&&`, comparisons, inline `style` objects, template literals, inline handlers, or value-building calls.
- Hoist every value into a named `const`, `useMemo`, or `useCallback` above the `return`, then reference the name.
- Author no raw DOM. A View may not open a lowercase HTML tag such as `<div>` or a `motion.*` tag. Put markup in a reusable View. Use `seldon/` for design components.
- Mark a genuinely hand-authored view as `*.bespoke.tsx`. A bespoke view opts out of the raw-markup rule. `WindowSurface.bespoke.tsx` is one, since no generated component covers a draggable, resizable window.
- Keep bare literal slot enablers inline. A positional `{}`, `null`, or `undefined` that only turns a slot on or off carries no logic.

These layers are lint rules in `eslint.config.mjs`, not convention. A View that imports a domain service or authors raw DOM fails the build. JSX authoring rules for AI agents live in `.cursor/rules/editor-jsx.mdc`.

---

## How This App Uses The Shared Package

The app imports shared logic as `@seldon/editor/lib/...` and registers the shared dev-server plugins in `vite.config.ts`. For example, a property row that sets an image resolves its target through `@seldon/editor/lib/dialogs/image-upload-target`, the same helper the Vue app uses.

When you add behavior, decide where it belongs. Platform-neutral logic goes in `@seldon/editor` so both apps share it. React-only interface code stays here. Mirror any interface change in the Vue app.

---

## Licensing

Seldon is offered under the **PolyForm Noncommercial License 1.0.0** by default, with a separate commercial license for commercial use.

### 1. Noncommercial license

The default software license is the **PolyForm Noncommercial License 1.0.0**.

- You may use, copy, and modify this software for **noncommercial purposes** such as research, education, and personal projects.
- Commercial use is **not permitted** under this license.
- See [license/noncommercial/LICENSE.md](../../license/noncommercial/LICENSE.md) for the summary and link to the full PolyForm text.

### 2. Commercial license

Commercial use covers proprietary software, SaaS platforms, internal business tools, and use as training data for AI or LLMs. You need a **commercial license** for these. See [COMMERCIAL-LICENSE.md](../../license/commercial/COMMERCIAL-LICENSE.md).

### 3. Obtaining a commercial license

Contact:

- **Licensor:** Seldon Digital, B.V.
- **Email:** info@seldon.digital

### 4. Summary

| Use | Requirement |
| --- | --- |
| Noncommercial use | PolyForm Noncommercial License 1.0.0 |
| Commercial use | Paid commercial license |

---

## Links

- [Shared editor](../editor/README.md)
- [Vue editor](../editor-vue/README.md)
- [Core](../core/README.md)
- [Factory](../factory/README.md)
- [Official Website](https://seldon.digital)

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.
