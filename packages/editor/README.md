# Seldon Local Editor (`@seldon/editor-local`)

Browser-only design editor. Workspaces live in **IndexedDB** on this machine. No Clerk, API, GitHub, or AI services.

## Run

From the repo root:

```bash
bun install
cd packages/editor
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:3000`).

## Workflows

- **New workspace** — create an empty v2 workspace and open it.
- **Open workspace.json** — import a file from disk into a new stored workspace.
- **Export workspace JSON** — download the current workspace from the File menu.
- **Export to folder** — run `@seldon/factory` in the browser and write files into a directory you pick (Chromium File System Access API).

## Monorepo packages

This app imports compute and export code directly from:

- `@seldon/core` — workspace reducers, property compute, themes
- `@seldon/factory` — canvas CSS helpers and `exportWorkspace`

## Forking

The hosted product editor remains at `services/editor` (Next.js + cloud). This package keeps the same App Router layout so you can add:

- `app/api/export/route.ts` for server-side export with Node `fs`
- `middleware.ts` for auth
- env-based API clients

See `app/api/README.md`.

## Browser support

Export to folder needs `showDirectoryPicker` (Chromium-based browsers). Workspace storage uses IndexedDB everywhere.
