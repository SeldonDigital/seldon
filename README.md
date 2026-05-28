# Seldon · Core, Editor, and Factory

[![License: PolyForm Noncommercial](https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue.svg)](LICENSE.md)

Seldon is a component-based design engine that has many moving parts.

- The **component catalog** in `packages/core` defines building blocks as schemas: identity, hierarchy level, default **properties**, and optional composition trees. 
- **Themes** hold reusable tokens (color, type, spacing, looks) that properties reference with `@` paths such as `@swatch.primary`. 
- A **workspace** is a JSON file that indexes components, stores **nodes** (defaults, variants, and instances with overrides), and holds theme and resource entries. 
- Property values merge from schema defaults, template chains, workspace overrides, and the active theme, amnd then are computed for use in the editor and for code export.

This repository ships that core library, a **local editor** (`packages/editor`) that edits workspaces in the browser, and **factory** export (`packages/factory`) for React and CSS. The editor runs as a single Next.js app on `localhost:3000`. Workspaces persist in IndexedDB on your machine. 

There is no Docker setup, standalone API, or external database in this repo. This is intentional.

---

## What to do with Seldon?

So you've accessed the repo and you're asking, "Now what?"

- **Experiment** with whatever parts of the codebase you want, and then revert it back if anything breaks.
- **Explore** ways to use AI or LLMs to build components or even try to write features in the editor to see where it works and where it falls on its face. 
- **Test ideas** out without the pressure of OKRs, MVP targets, Product Requirements, or other bullshit being tossed your way by some corporate overload who doesn't understand what `console.log("Hello, world!")` even means.
- **Break the code** on purpose to see where the limits of the model are. 

Build sandcastles.

Try things. Why? Just because. 

Play.

Definitely play.

The pupose for releasing this project is to provide a codebase that allows for multiple paths for exploration to as many people as possible. To give folks an inexpensive way to learn what they can and cannot do with AI tools.

No one knows where the future will land. There are a lot of ideas out there of what LLMs and AI mean for humanity. Most of thoe ideas are silly. Many of them are just plain wrong. Some of them have some value. One thing that should become clear over time however is that humanity doesn't need AI or LLMs to waste enormous amounts of energy and money to write a Button component. 

The model Seldon is offering is simple: A workspace defines everything needed as simple key value pairs in JSON. A core engine defines everything about a workspace, has the code to mutate data, and validation to make sure a workspace file is valid. Then a code factory (written by humans) takes that workspace file and processes that data for whatever platform is needed. Code is exported, and its bullet proof.

And as a bonus, there's an editor provided that runs locally to allow you to do this visually instead of as code.

---

## Where to go from here

At the time of this writing, Seldon is far from complete. It is missing many features, behaviors, code export languages, and a host of other things. But rather than wait until its all done and build in a closed environment, we're going to build it out in the open and evolve it based on your feedback.

In various parts of the codebase, you'll find README docs that contain feature lists and priorities for that section of the codebase. As features come online, they will be pushed to main and you'll have access to them immediately. There's a lot to do, so we also need feedback on what is working, what is not, and what should be added sooner than later.

By the end of the first year, we expect to have a fairly robust codebase that will be able to do a whole of things not easily possible today. As that begins to take shape, we'll all be able to better see where the future is going.

But we fully expect that wasting money and energy on Button code will still not be a thing.

---

## The Gist

- `packages/core`: workspace, theme, and reducer logic used by an editor or agent to mutate workspace.json files
- `packages/editor`: Next.js visual editor run on localhost
- `packages/factory`: Component Export, CSS, and code generation from a valid workspace.json file

## Prerequisites

Install **Node.js** and **npm** before you run the editor. This repo targets **Node 22** (see `volta.node` in [package.json](package.json), currently `22.18.0`). Use [nodejs.org](https://nodejs.org/) or a version manager such as [Volta](https://volta.sh/) or [nvm](https://github.com/nvm-sh/nvm).

The editor is implemented with Next.js 16 (App Router). Next is installed via `npm install`, you do not install it separately.

`@seldon/core` and `@seldon/factory` are not tied to Next. If you build your own editor, you can use any React setup (or no React at all for headless tooling). Replacing Next in `packages/editor` would be a deliberate port of that app, not a supported one-line switch.

## Run Locally

Clone the repository, and then from the repo root in your terminal:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## The Full Breakdown

Here's all of the documentation for code under `packages/`. Do not assume all of these documents are correct. There is a lot to work thorugh, and some documents may have not been updated properly as code was pushed. If you find any errors, please report them so we can make these documents as clear and accurate as possible.

---

### Core

`packages/core`

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

---

### Editor

`packages/editor`

| Topic | Summary | Link |
| --- | --- | --- |
| Editor | Local Next.js editor, run commands, and workflows | [packages/editor/README.md](packages/editor/README.md) |
| └ Components | Generated and maintained UI component reference | [packages/editor/app/seldon/README.md](packages/editor/app/seldon/README.md) |

---

### Factory

`packages/factory`

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
