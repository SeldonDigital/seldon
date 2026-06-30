# Seldon · Core, Editor, and Factory

[License: PolyForm Noncommercial](LICENSE.md)

Seldon is a component-based design engine that consists of three main parts.

![Seldon Editor](screenshots/seldon-editor.png)

---

The [Seldon Core](packages/core/README.md) is the engine that defines component-based design systems. It ships a catalog of component building blocks, properties, and theme models those components use. It is also the processing engine for design workspace files.

Core owns design state and rules. Editors, agents, and other tools load a workspace, apply typed actions via the Core, and get validated JSON back. Workspaces can then be passed to the Factory for code and asset generation at any point in time.

---

The [Seldon Factory](packages/factory/README.md) turns a Seldon workspace into production code. It consumes a workspace file and produces components, CSS, and processed assets. Factory reads design-time state from Core, resolves properties and themes, and generates output. It does not change the workspace file.

Factory owns export and production code generation. It can be extended beyond one platform, since multiple factory pipelines can be supported. React is the default Factory for now.

---

The [Seldon Editor](packages/editor/README.md) is a browser design client for Seldon workspaces. It runs locally on your computer, creates and stores workspaces, and needs no API, database, auth, or cloud service. The Editor runs as a single app on `localhost:5173`.

A user opens a workspace with the Editor, edits components, and each action flows through the same Core reducer engine that an AI agent would use.

The Editor that ships with this repo serves multiple purposes: to provide users with a graphical way to edit components, to consume components for dogfooding, and as a way to make sure no special code or logic is created that prevents an AI agent from executing the same set of actions.

---

There is no Docker setup, standalone API, or external database in this repo. This is intentional.

---

This repository packages up these three pieces to be run on your machine. All of the code is out in the open.

Why?

**We don't believe you need AI to write button code.**

In fact, given the past nine months I've spent in the trenches getting Seldon to this point, I'm even more convinced that having AI and LLMs waste tokens, cycles, energy, and money on writing front-end code from scratch is largely a waste of time and money.

Wasting large amounts of compute, energy, and money on creating code that is largely a solved problem seems like a massive opportunity cost for everyone involved. We are spending far more time and money trying to rein in non-deterministic models instead of exploring the new ways AI can help us build products of the future.

But if it's solved, what's the issue?

Most front-end product problems lack a rigorous, structured approach to their design definitions, even when using design systems. Teams create some rigor to build products at scale, and yet they inevitably run into the handoff problem. At the heart of this is that design and code are disconnected.

They have been for decades now.

Add AI to that mix and what happens is massive overspend and more unnecessary complexity with the front-end code as models go off on all sorts of unnecessary tangents. AI handles the v.0 to v.1 jump amazingly well, but iterating past that to v.2, then to v.3 and beyond? That's where it crashes and burns. Throwing more data and compute at all of this will not solve the problem.

It's not a problem that needs solving.

What we do need is a structured approach to the design of components, in the same way PostScript gave print a language, and web standards gave browsers dependability. We need a way to define design for digital products that is rooted in code, while based on design practice.

Once we have that structured approach with a standard JSON artifact, then we have the thing AI can manipulate. At this task LLMs really shine. Rather than attempting to make pseudo-random number generators try to behave deterministically by throwing massive amounts of data, energy, and money at them, all you need is for LLMs to manipulate JSON through an engine. Standardized data as the input, processed through a machine, generates deterministic output. It's the model we all use today in printers, web browsers, and telecommunications.

The purpose of releasing Seldon into the wild is to provide a starting point that can evolve into that structure and architecture while also allowing for as many paths of exploration as possible. Paths that are far more interesting and include human beings as the ones driving what new tools and processes they need out of the technology.

---

No one knows where the future will land.

There are a lot of opinions out there about what LLMs and AI mean for humanity. Most of those opinions are based on a thin understanding of technology, or a cynical view of human beings. Many opinions about AI are just plain wrong and need to be called out directly. A few have real value.

One thing that should become clear over time, however, is that humanity doesn't need AI or LLMs to waste enormous amounts of energy and money to write the code for a Button component.

---

This is what Seldon offers:

- A design workspace that is structured as a standard JSON file. This workspace contains components, playgrounds, themes, font collections, icon collections, and media.
- A core engine that defines how everything in that JSON file can be manipulated. The Core engine has the code to create components, mutate data, transform data, and process it all to make sure a workspace is validated.
- An editor run locally that works like traditional apps. The actions the editor can take are the same set of actions an AI agent can take.
- A code factory that takes a workspace file and processes it to create code for targeted platforms. For starters, React. Later Swift, Java, or something else.

Seldon is a machine.

You give it an input, Seldon processes that input, and returns to you an output. Output that is entirely deterministic.

Code that is deterministic. It just works.

---

## Prerequisites

Install [Node.js](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) before you run the Editor.

---

## Run Locally

Once you have **Node.js** and **npm**, clone the repository from GitHub:

```bash
git clone https://github.com/SeldonDigital/seldon.git
```

Or over SSH:

```bash
git clone git@github.com:SeldonDigital/seldon.git
```

Then from your terminal:

```bash
cd seldon
npm install
npm run dev
```

The Editor is a single-page app built with [Vite](https://vite.dev/) and [React Router](https://reactrouter.com/). Its dependencies install when you run `npm install`. You do not install them separately.

`@seldon/core` and `@seldon/factory` are not tied to the editor. If you build your own editor, you can use any React setup, or no React at all for headless tooling.

---

Then open `http://localhost:5173` in your browser. You should now have the editor running locally.

---

## Scripts

CI runs four checks on every pull request to `main`. Run them locally before you submit a PR so your branch passes. First install:

```bash
npm ci
```

Unit tests run on [Bun](https://bun.sh). Be sure to install **Bun** before you run them.

---

Then run each check.

Format:

```bash
npm run format:check
```

To fix formatting instead of only checking it:

```bash
npm run format
```

Lint:

```bash
npm run lint --workspace @seldon/core --workspace @seldon/factory --workspace @seldon/editor
```

Typecheck:

```bash
npx tsc --build packages/core/tsconfig.json && npx tsc -p packages/factory/tsconfig.json && npx tsc -p packages/editor/tsconfig.json
```

Unit tests:

```bash
npm test --workspace @seldon/core
```

---

## Where to go from here

At the time of this writing, Seldon is just getting off the ground. It is missing features, behaviors, code export for Swift and Java, and other pieces. But rather than wait until it's all done—building all of this in a closed environment—we're going to build it out in the open and evolve it based on your feedback. Hopefully many of you will become contributors as well.

There's a lot to do. We need feedback on what is working, what is not, and what should be added sooner rather than later. "It's a process," as they say. By the end of the first year, we expect to have a fairly robust codebase that will be able to do a whole host of things not easily possible today—including a robust, locally run Editor that works as well as any design tool on the market. 

---

### The Vault

If you want the lowdown, these three documents are a great way to get into what this codebase offers, and where it is going.

- `packages/core` [packages/core/README.md](packages/core/README.md): This is the workspace, theme, and reducer logic used by an editor or agent to mutate workspace.json files
- `packages/editor` [packages/editor/README.md](packages/editor/README.md): Visual editor that runs on localhost
- `packages/factory` [packages/factory/README.md](packages/factory/README.md): Component Export, CSS, and code generation from a valid workspace.json file

---

### The Prime Radiant

- `packages/core/workspace` [packages/core/workspace/README.md](packages/core/workspace/README.md): TypeScript shapes for saved workspace files, rules, behaviors, and processing
- `packages/core/components` [packages/core/components/README.md](packages/core/components/README.md): Schema shapes, hierarchy, and composition rules
- `packages/core/properties` [packages/core/properties/README.md](packages/core/properties/README.md): Property types and values
- `packages/core/themes` [packages/core/themes/README.md](packages/core/themes/README.md): Token sections, references, and stock themes
- `packages/core/font-collections` [packages/core/font-collections/README.md](packages/core/font-collections/README.md): Font family collections, origins, and stacks
- `packages/core/icon-sets` [packages/core/icon-sets/README.md](packages/core/icon-sets/README.md): Icon set catalog and icon ids

---

## Licensing

Seldon is offered under the **PolyForm Noncommercial License 1.0.0** by default, with a separate commercial license for commercial use.

| Use | Requirement |
| --- | --- |
| Noncommercial use | PolyForm Noncommercial License 1.0.0 |
| Commercial use | Paid commercial license |

### 1. Noncommercial license

The default software license is the **PolyForm Noncommercial License 1.0.0**.

- You may use, copy, and modify this software for **noncommercial purposes** such as research, education, and personal projects.
- Commercial use is **not permitted** under this license.
- See [license/noncommercial/LICENSE.md](license/noncommercial/LICENSE.md).

### 2. Commercial license

Commercial use covers proprietary software, SaaS platforms, internal business tools, and use as training data for AI or LLMs. You need a **commercial license** for these.

The commercial license may grant:

- Use in commercial or for-profit contexts.
- Ability to create proprietary derivative works as stated in your agreement.
- Long-term support, security updates, and priority bug fixes if offered by the licensor.
- Optional custom terms negotiated with the licensor.
- See [COMMERCIAL-LICENSE.md](license/commercial/COMMERCIAL-LICENSE.md).

To obtain a commercial license, contact:

- **Licensor:** Seldon Digital, B.V.
- **Email:** [info@seldon.digital](mailto:info@seldon.digital)

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.
