# Seldon · Editor (`@seldon/editor`)

Browser-only design editor. Workspaces live in **IndexedDB** on this machine. No API, database, auth, or cloud services are required for the baseline app.

## Run

From the repo root:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:3000`).

Or run the editor package directly:

```bash
cd packages/editor
npm install
npm run dev
```

## Workflows

- **New workspace** — create an empty v2 workspace and open it.
- **Open workspace.json** — import a file from disk into a new stored workspace.
- **Export workspace JSON** — download the current workspace from the File menu.
- **Debug mode** — use Help -> Enable Debug Mode to log locally while developing.

## Monorepo packages

This app imports compute and export code directly from:

- `@seldon/core` — workspace reducers, property compute, themes
- `@seldon/factory` — canvas CSS helpers and `exportWorkspace`

--- 

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.