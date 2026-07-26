# Seldon · Editor (Vue)

`@seldon/editor-vue` is the Vue build of the Seldon design client. It runs in the browser, edits a Seldon workspace, and turns each gesture into a typed **action** that flows through the same Core reducer an AI agent would use.

This app owns the Vue interface: components, composables, and Pinia stores. It imports the platform-neutral logic, dev-server plugins, and static assets from `@seldon/editor`. It mirrors the React build in `@seldon/editor-react` one to one, so a workspace edited in one editor opens in the other. Read the shared contract in [../editor/README.md](../editor/README.md) first.

---

## Stack

- **Vite 8** with **Vue 3.5** and `<script setup>`. `src/main.ts` mounts a `vue-router` router defined in `app/router.ts` with two routes: `/` for the home page and `/:id` for the editor.
- **Pinia** holds runtime state. Stores replace the React app's zustand stores.
- **motion-v** drives window and panel animation, matching framer-motion in the React app. **splitpanes** handles resizable panes. **panzoom** drives canvas zoom and pan. **@atlaskit/pragmatic-drag-and-drop** drives tree and canvas drag.
- **markdown-it** and **shiki** render the AI chat. **@vueuse/core** and **hotkeys-js** cover reactive utilities and shortcuts.
- The workspace store is the shared filesystem store served at `/api/workspaces`, so a workspace saved here opens in the React editor. See [../editor/README.md](../editor/README.md).
- Imports use path aliases: `@app` for `app/`, `@seldon/components` for `seldon/`, and `@seldon/editor` for the shared package, alongside `@seldon/core`, `@seldon/factory`, and `@seldon/ai`.

### Run steps

- `npm run dev` copies font licenses and font files, then starts Vite on port 5174. The AI agent uses the local Ollama server the React editor's `dev` script ensures.
- `npm run build` type-checks with `vue-tsc` and builds the production bundle. `npm start` serves the build with `vite preview`.
- `npm run quality` type-checks with `vue-tsc --noEmit`. `npm run lint` runs ESLint. `npm run export:seldon` regenerates the `seldon/` components.

---

## Layout

### `src/`

`src/main.ts` is the entry. It mounts `App.vue`, the router, and Pinia, and configures the shared workspace store as the Vue editor.

### `app/` — the Vue interface

| Area | Role |
| --- | --- |
| `editor/` | Editor page, project init, and Pinia stores |
| `canvas/` | Canvas surface, node rendering, and per-node CSS |
| `sidebars/` | Objects sidebar and properties sidebar |
| `topbar/` | Menus and tools |
| `dialogs/` | Catalog inserts, component create and export, image upload |
| `menus/` | Combobox and context menus, draggable window composable |
| `windows/` | `WindowSurface.vue` window chrome |
| `palettes/` | The Hari AI chat surface |
| `tracking/` | Hover and selection indicators |
| `focus/`, `toaster/` | Focus ring and toasts |
| `persistence/` | Autosave and active workspace state |
| `workspace/`, `commands/` | Workspace composables and gesture commands |
| `core/` | Vue-side adapters over shared logic |
| `io/`, `home/`, `overlays/` | Import and export, home page, overlays |

### `seldon/` — generated View library

`seldon/` holds the generated `.vue` design components the app binds to. These files are generated, so do not hand-edit them. Regenerate with `npm run export:seldon`.

### `scripts/`

Font copy and `seldon/` export.

---

## MVVM In Vue

The app follows the editor MVVM layering from [../editor/README.md](../editor/README.md). In Vue:

- **View**: generated `.vue` components in `seldon/`, plus editor chrome views. A View binds named values and renders element tags. It computes nothing.
- **ViewModel**: `use-*.ts` composables and Pinia stores. Some controller components act as view-models. A view-model owns UI state, derives display values, wires commands, and assembles the props the View binds to.
- **Model**: `@seldon/core` services and the shared `@seldon/editor` lib.

### View rules

- Compute nothing inside the template beyond identifier references and slot enablers. Hoist derived values into `computed` or a named `const` in `<script setup>`, then bind the name.
- Author no raw DOM in a View. Put markup in a reusable View. Use `seldon/` for design components.
- Mark a genuinely hand-authored view as `*.bespoke.vue`. `WindowSurface.vue` is bespoke, since no generated component covers a draggable, resizable window and it builds on `motion-v`.

---

## Dialogs

The dialogs render generated `seldon/` modules inside `WindowSurface.vue`, so they match the React editor instead of using hand-rolled markup.

- `WindowSurface.vue` is the draggable, resizable window shell. It builds on `motion-v` drag controls, teleports to the body, re-applies the editor theme and mode, and renders resize handles from the shared `resize` utility.
- `PanelDialogController.vue` is the shared controller for the catalog dialogs. `ComponentsDialog.vue` and `BoardsDialog.vue` bind it with their own filters and pick handlers, driven by `use-catalog-dialog.ts`.
- The stock resource dialogs are split to mirror React one to one: `ThemesDialog.vue`, `FontCollectionsDialog.vue`, and `IconSetsDialog.vue`, each driven by `use-stock-catalog.ts`.
- `CreateComponentDialog.vue` and `ExportDialog.vue` bind the generated `DialogCreateComponent` and `DialogExportComponent` modules, wired to `MenuController` for the dropdowns.
- The image upload flow lives in `dialogs/image-upload/`. `ImageUploadController.vue` renders a `PanelDialog` with `ImageDropzone.vue` in its content slot. `use-image-upload-panel.ts` reads the file to a data URL and writes it onto the selection's `source` or `background` image. The row target resolves through the shared `@seldon/editor/lib/dialogs/image-upload-target` helper.

Two Vue-specific notes carried over from this work:

- Vue normalizes event names, so a native pointer handler binds as `onPointerdown`, not `onPointerDown`, for drag to start.
- The footer button group renders only when its frame prop is present, so dialog controllers pass an empty `frame2` to keep the Cancel and confirm buttons aligned with `space-between`.

---

## How This App Uses The Shared Package

The app imports shared logic as `@seldon/editor/lib/...` and registers the shared dev-server plugins in `vite.config.ts`. Platform-neutral logic lives in `@seldon/editor` so both apps share one definition. Vue-only interface code stays here. Mirror any interface change in the React app so the two editors do not drift.

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
- [React editor](../editor-react/README.md)
- [Core](../core/README.md)
- [Factory](../factory/README.md)
- [Official Website](https://seldon.digital)

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.
