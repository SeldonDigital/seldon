# Seldon

[![License: PolyForm Noncommercial](https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue.svg)](docs/licenses/noncommercial/LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](docs/licenses/contributors/CONTRIBUTING.md)

Browser-only local editor baseline for Seldon. This branch is intentionally scoped to a simple `localhost:3000` webapp with no Docker, no standalone API, and no external database.

## Packages

- `packages/editor`: Next.js local editor UI
- `packages/core`: workspace, theme, and reducer logic used by the editor
- `packages/factory`: shared CSS/export helpers still imported by the editor

## Run locally

From the repo root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

You can also work directly from `packages/editor`:

```bash
cd packages/editor
npm install
npm run dev
```

## What the baseline keeps

- Workspaces stored locally in IndexedDB
- Import/export of `workspace.json`
- Shared editor logic in the `core` and `factory` packages

## License

Dual-licensed under PolyForm Noncommercial License for noncommercial use. Commercial use requires a paid license.
