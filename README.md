# Seldon

[![License: PolyForm Noncommercial](https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue.svg)](LICENSE.md)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](license/contributors/CONTRIBUTING.md)

Browser-only local editor baseline for Seldon. This branch is intentionally scoped to a simple `localhost:3000` webapp with no Docker, no standalone API, and no external database.

## Packages

- `packages/core`: workspace, theme, and reducer logic used by an editor or agent to mutate workspace.json files
- `packages/editor`: Next.js visual editor run on localhost
- `packages/factory`: Component Export, CSS, and code generation from a valid workspace.json file

## Run locally

From the repo root:

```bash
npm install
npm run dev
```
---

Open `http://localhost:3000`.

---

## The Full Breakdown

Documentation for code under `packages/`. Do not assume all of these documents are correct. There is a lot to work thorugh, and some documents may have not been updated properly. If you find any errors, please report them so we can make these documents as clear and accurate as possible.

### Core

| Topic | Summary | Link |
| --- | --- | --- |
| Core Package | Package overview, areas, and main `@seldon/core` exports | [packages/core/README.md](packages/core/README.md) |
| Architecture | How catalog, properties, themes, and workspace fit together | [packages/core/CORE.md](packages/core/CORE.md) |
| Glossary | Shared terms for workspace, properties, and themes | [packages/core/GLOSSARY.md](packages/core/GLOSSARY.md) |
| Components | Catalog layout and schema lookup API | [packages/core/components/README.md](packages/core/components/README.md) |
| └ Reference | Schema shapes, hierarchy, and composition rules | [packages/core/components/COMPONENTS.md](packages/core/components/COMPONENTS.md) |
| Properties | Property pipeline folders and entry points | [packages/core/properties/README.md](packages/core/properties/README.md) |
| └ Reference | Property types, merge rules, and compute | [packages/core/properties/PROPERTIES.md](packages/core/properties/PROPERTIES.md) |
| └ Types | Property key unions and TypeScript shapes | [packages/core/properties/types/README.md](packages/core/properties/types/README.md) |
| └ Values | Tagged value modules per property family | [packages/core/properties/values/README.md](packages/core/properties/values/README.md) |
| └ Constants | `ValueType`, compound metadata, display order | [packages/core/properties/constants/README.md](packages/core/properties/constants/README.md) |
| └ Schemas | Schema catalog for UI and validation | [packages/core/properties/schemas/README.md](packages/core/properties/schemas/README.md) |
| └ Helpers | Merge, paths, and preset helpers | [packages/core/properties/helpers/README.md](packages/core/properties/helpers/README.md) |
| └ Computed Properties | `computeProperties` and compute engines | [packages/core/properties/compute/README.md](packages/core/properties/compute/README.md) |
| Themes | Stock themes, compute, and token folders | [packages/core/themes/README.md](packages/core/themes/README.md) |
| └ Reference | Token sections, references, and stock themes | [packages/core/themes/THEMES.md](packages/core/themes/THEMES.md) |
| └ Stock Themes | Shipped theme files by template id | [packages/core/themes/stock/README.md](packages/core/themes/stock/README.md) |
| └ Types | Theme ids, token ids, and reference keys | [packages/core/themes/types/README.md](packages/core/themes/types/README.md) |
| └ Constants | `TokenType`, harmony, and colorspace enums | [packages/core/themes/constants/README.md](packages/core/themes/constants/README.md) |
| └ Schemas | Theme section and token cell schemas | [packages/core/themes/schemas/README.md](packages/core/themes/schemas/README.md) |
| └ Tokens | Token cell value guards | [packages/core/themes/values/README.md](packages/core/themes/values/README.md) |
| └ Helpers | `computeTheme`, normalize, and palette helpers | [packages/core/themes/helpers/README.md](packages/core/themes/helpers/README.md) |
| └ Computed Tokens | Dynamic swatches and theme-side compute | [packages/core/themes/compute/README.md](packages/core/themes/compute/README.md) |
| └ Looks | Built-in LOOK presets and `@` look resolution | [packages/core/themes/looks/README.md](packages/core/themes/looks/README.md) |
| Workspaces | Reducer, services, compute, and migration layout | [packages/core/workspace/README.md](packages/core/workspace/README.md) |
| └ Reference | Serialized workspace JSON format and integrity | [packages/core/workspace/WORKSPACE.md](packages/core/workspace/WORKSPACE.md) |
| └ Model | TypeScript shapes for saved workspace files | [packages/core/workspace/model/README.md](packages/core/workspace/model/README.md) |
| └ Reducers | `workspaceReducer`, actions, and handlers | [packages/core/workspace/reducers/README.md](packages/core/workspace/reducers/README.md) |
| └ Services | Propagation, type checking, and property writes | [packages/core/workspace/services/README.md](packages/core/workspace/services/README.md) |
| └ Helpers | Graph, rules mapping, and theme helpers | [packages/core/workspace/helpers/README.md](packages/core/workspace/helpers/README.md) |
| └ Computed Properties | Effective and computed node properties and themes | [packages/core/workspace/compute/README.md](packages/core/workspace/compute/README.md) |
| └ Migration | Version migrations on workspace load | [packages/core/workspace/middleware/migration/README.md](packages/core/workspace/middleware/migration/README.md) |
| Rules | Mutation policy and component nesting rules | [packages/core/rules/README.md](packages/core/rules/README.md) |
| Core Helpers | Color, resolution, validation, and theme utilities | [packages/core/helpers/README.md](packages/core/helpers/README.md) |
| Icon categories | Icon set category paths and naming | [packages/core/icons/CATEGORIES.md](packages/core/icons/CATEGORIES.md) |

### Editor

| Topic | Summary | Link |
| --- | --- | --- |
| Editor | Local Next.js editor, run commands, and workflows | [packages/editor/README.md](packages/editor/README.md) |
| └ Components | Generated and maintained UI component reference | [packages/editor/app/seldon/README.md](packages/editor/app/seldon/README.md) |

### Factory

| Topic | Summary | Link |
| --- | --- | --- |
| Factory | Workspace-to-export pipeline overview | [packages/factory/README.md](packages/factory/README.md) |
| └ Technical Reference | Detailed factory architecture and APIs | [packages/factory/TECHNICAL.md](packages/factory/TECHNICAL.md) |
| └ React export | React component generation from workspaces | [packages/factory/export/react/README.md](packages/factory/export/react/README.md) |
| └ React Export Tech Reference | React export pipeline reference | [packages/factory/export/react/TECHNICAL.md](packages/factory/export/react/TECHNICAL.md) |
| └ CSS Export | CSS stylesheet generation from workspaces | [packages/factory/export/css/README.md](packages/factory/export/css/README.md) |
| └ CSS Export technical reference | CSS export pipeline reference | [packages/factory/export/css/TECHNICAL.md](packages/factory/export/css/TECHNICAL.md) |

---

## Licensing overview

Seldon is offered under a **layered model**: repository access, then software use licenses.

### 1. Repository access

You must pay the agreed flat fee to access the private GitHub repository (view, clone, fork on GitHub).

- See [REPOSITORY-ACCESS.md](license/access/REPOSITORY-ACCESS.md) for fees, forks, termination, and contributor access (TBD).
- The access fee does **not** include commercial-use rights.

### 2. Noncommercial license

The default software license is the **PolyForm Noncommercial License 1.0.0**.

- You may use, copy, and modify this software for **noncommercial purposes** (e.g. research, education, personal projects).
- Commercial use is **not permitted** under this license.
- See [license/noncommercial/LICENSE.md](license/noncommercial/LICENSE.md) for the summary and link to the full PolyForm text.

This license applies to your use of the code **after** you lawfully obtain the source through paid repository access.

### 3. Commercial license

For commercial use (including proprietary software, SaaS platforms, internal business tools, or use as training data for AI or LLMs), you need a **commercial license** separate from the repository access fee.

The commercial license may grant:

- Use in commercial or for-profit contexts.
- Ability to create proprietary derivative works (as stated in your agreement).
- Long-term support, security updates, and priority bug fixes if offered by the licensor.
- Optional custom terms negotiated with the licensor.

See [COMMERCIAL-LICENSE.md](license/commercial/COMMERCIAL-LICENSE.md).

### 4. Obtaining a commercial license

Contact:

- **Licensor:** Seldon Digital, B.V.
- **Email:** info@seldon.digital

### 5. Summary

| Role | Requirement |
|------|-------------|
| Anyone obtaining source | Paid repository access |
| Noncommercial use | PolyForm Noncommercial License 1.0.0 (after access) |
| Commercial use | Paid commercial license (separate from access fee) |

Note: Noncommercial use does not require a commercial license, but it still requires paid repository access to obtain the source from the official private repository.
