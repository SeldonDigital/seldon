# Seldon · Core, Editor, and Factory

[License: PolyForm Noncommercial](LICENSE.md)

Seldon is a component-based design engine that has many moving parts.

- The **component catalog** in `packages/core` defines building blocks as schemas: identity, hierarchy level, default **properties**, and optional composition trees. 
- **Themes** hold reusable tokens (color, type, spacing, looks) that properties reference with `@` paths such as `@swatch.primary`. 
- A **workspace** is a JSON file that indexes components, stores **nodes** (defaults, variants, and instances with overrides), and holds theme and resource entries. 
- Property values merge from schema defaults, template chains, workspace overrides, and the active theme, and then are computed for use in the editor and for code export.

This repository ships that core library, a **local editor** (`packages/editor`) that edits workspaces in the browser, and **factory** export (`packages/factory`) for React and CSS. The editor runs as a single Vite app on `localhost:5173`. Workspaces persist in IndexedDB on your machine. 

There is no Docker setup, standalone API, or external database in this repo. This is intentional.

---

## Prerequisites

Install **Node.js** and **npm** before you run the editor.

The editor is a single-page app built with Vite and React Router. Its dependencies install with `npm install`. You do not install them separately.

`@seldon/core` and `@seldon/factory` are not tied to the editor. If you build your own editor, you can use any React setup (or no React at all for headless tooling).

## Run Locally

Once you have the prerequisites, clone the repository and then from the repo root in your terminal:

```bash
npm install
npm run dev
```

---

Then open `http://localhost:5173` in your browser. You should now have the editor running locally.

---

## What to do with Seldon?

So you've accessed the repo and you're asking, "Now what?"

- **Experiment** with whatever parts of the codebase you want, and then revert if anything breaks.
- **Explore** ways to use AI or LLMs to build components or even try to write features in the editor to see where it works and where it falls on its face. 
- **Test ideas** out without the pressure of OKRs, MVP targets, Product Requirements, or other bullshit being tossed your way by some corporate overlord who doesn't understand what `console.log("Hello, world!")` even means.
- **Break the code** on purpose to see where the limits of the model are. 
- Build sandcastles.
- Try things. Why? Just because. 
- Play. Definitely play.

The purpose of releasing this project is to provide a codebase that allows for multiple paths for exploration to as many people as possible. To give folks an inexpensive way to learn what they can and cannot do with AI tools.

No one knows where the future will land. There are a lot of ideas out there of what LLMs and AI mean for humanity. Most of those ideas are silly. Many of them are just plain wrong. Some of them have some value. One thing that should become clear over time however is that humanity doesn't need AI or LLMs to waste enormous amounts of energy and money to write the code for a Button component. 

The model Seldon is offering is simple: A workspace defines everything needed as simple key value pairs in JSON. A core engine defines everything about a workspace, has the code to mutate data, and validation to make sure a workspace file is valid. Then a code factory takes that workspace file and processes that data for whatever platform is needed, be it React, Swift, Java, or whatever is needed. Code is exported, and it just works.

And as a bonus, there's an editor provided that runs locally to allow you to do this visually instead of as code.

---

## Where to go from here

At the time of this writing, Seldon is far from complete. It is missing many features, behaviors, code export languages, and a host of other things. But rather than wait until it's all done and build in a closed environment, we're going to build it out in the open and evolve it based on your feedback.

In various parts of the codebase, you'll find README docs that contain feature lists and priorities for that section of the codebase. As features come online, they will be pushed to main and you'll have access to them immediately. 

There's a lot to do, so we also need feedback on what is working, what is not, and what should be added sooner rather than later.

By the end of the first year, we expect to have a fairly robust codebase that will be able to do a whole host of things not easily possible today. As that begins to take shape, we'll all be able to better see where the future is going.

But we fully expect that wasting money and energy on writing Button code will still not be a thing.

---

### The Vault

If you want the lowdown, these three documents are a great way to get into what this codebase offers, and where it is going.

- `packages/core` [packages/core/README.md](packages/core/README.md): This is the workspace, theme, and reducer logic used by an editor or agent to mutate workspace.json files
- `packages/editor` [packages/editor/README.md](packages/editor/README.md): Vite visual editor run on localhost
- `packages/factory` [packages/factory/README.md](packages/factory/README.md): Component Export, CSS, and code generation from a valid workspace.json file

---

### The Prime Radiant

- `packages/core/workspace` [packages/core/workspace/README.md](packages/core/workspace/README.md): TypeScript shapes for saved workspace files, rules, behaviors, and processing
- `packages/core/components` [packages/core/components/README.md](packages/core/components/README.md): Schema shapes, hierarchy, and composition rules
- `packages/core/properties` [packages/core/properties/README.md](packages/core/properties/README.md): Property types and values
- `packages/core/themes` [packages/core/themes/README.md](packages/core/themes/README.md): Token sections, references, and stock themes
- `packages/core/font-collections` [packages/core/font-collections/README.md](packages/core/font-collections/README.md): TBD
- `packages/core/icon-sets` [packages/core/icon-sets/README.md](packages/core/icon-sets/README.md): TBD
- `packages/core/media` [packages/core/media/README.md](packages/core/media/README.md): TBD|

---

## Licensing

Seldon is offered under the **PolyForm Noncommercial License 1.0.0** by default, with a separate commercial license for commercial use.

| Use               | Requirement                          |
| ----------------- | ------------------------------------ |
| Noncommercial use | PolyForm Noncommercial License 1.0.0 |
| Commercial use    | Paid commercial license              |

### 1. Noncommercial license

The default software license is the **PolyForm Noncommercial License 1.0.0**.

- You may use, copy, and modify this software for **noncommercial purposes** (e.g. research, education, personal projects).
- Commercial use is **not permitted** under this license.
- See [license/noncommercial/LICENSE.md](license/noncommercial/LICENSE.md).

### 2. Commercial license

For commercial use (including proprietary software, SaaS platforms, internal business tools, or use as training data for AI or LLMs), you need a **commercial license**.

The commercial license may grant:

- Use in commercial or for-profit contexts.
- Ability to create proprietary derivative works (as stated in your agreement).
- Long-term support, security updates, and priority bug fixes if offered by the licensor.
- Optional custom terms negotiated with the licensor.
- See [COMMERCIAL-LICENSE.md](license/commercial/COMMERCIAL-LICENSE.md).

To obtain a commercial license, contact:

- **Licensor:** Seldon Digital, B.V.
- **Email:** [info@seldon.digital](mailto:info@seldon.digital)

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.