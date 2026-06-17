# Seldon · Core, Editor, and Factory

[License: PolyForm Noncommercial](LICENSE.md)

Seldon is a component-based design engine that consists of three main parts.

![Seldon Editor](screenshots/seldon-editor.png)

### The Core

[Seldon Core](packages/core/README.md) is the engine that defines component-based design systems. It ships a catalog of component building blocks, property and theme models those components use, and the processing engine that creates and saves out design workspace files. 

Core owns design state and rules. Editors, agents, and other tools load a workspace, apply typed actions via the Core, and validated JSON is returned. Workspaces can then passed to the Factory for code and asset generation at any point in time.

### The Factory

[Seldon Factory](packages/factory/README.md) turns a Seldon workspace into production code. It consumes a workspace file and produces components, CSS, and processed assets. Factory reads design-time state from Core, resolves properties and themes, and generates output. It does not change the workspace file.

Factory owns export and production code generation. It can be extended beyond just one platform, as multiple factory pipelines can be supported. (React is the default Factory for now.)

### The Editor

[Seldon Editor](packages/editor/README.md) is a browser design client for Seldon workspaces. It runs locally on your computer, creates and store workspaces, and needs no API, database, auth, or cloud service. The Editor runs as a single Vite app on `localhost:5173`. 

A user opens a workspace with the Editor, edits components, and each action flows through the same Core reducer engine that an AI agent would use. 

The Editor that ships with this repo serves multiples purposes: to provide users with a graphical way to edit components, to consume components for dogfooding, and as a way to make sure no special code or logic is created that blocks out an AI agent from being able to execute the same set of actions. 

---

There is no Docker setup, standalone API, or external database in this repo. This is intentional.

---

This repository packages up these three pieces to be run on your machine. All of the code is out in the open. 

Why?

**We don't believe you need AI to write button code.**

Wasting large amounts of compute, energy, and money on creating code that is largely a solved problem seems like a massive opportunity cost across the board. Most front end and design problems lack a structured approach to the problem, the same type of structure that has been the basis for much in the world design. 

The purpose of releasing this project is to provide a codebase that can evolve while also allowing for multiple paths for exploration as possible. To give folks a way to learn what they can and cannot do with AI and creative tools.

No one knows where the future will land. There are a lot of ideas out there of what LLMs and AI mean for humanity. Most of those ideas are a bit thin. Many of them are just plain wrong. Some of them have some value. One thing that should become clear over time however is that humanity doesn't need AI or LLMs to waste enormous amounts of energy and money to write the code for a Button component.

The model Seldon is offering is simple: 

- A workspace defines the structure needed as simple key value pairs in JSON. 
- A core engine defines how everything can be manipulated in the workspace. It has the code to mutate data, and validation to make sure a workspace file is valid. 
- A code factory takes that workspace file and processes it to create code for whatever platform is needed, be it React, Swift, Java, or whatever is needed. 

Code is exported, its deterministic, and it just works.

This leaves folks to use AI to work on the actual future rather than throwing massive data at scale to figure out how to get that AI to write code that goes from version 1 to 2 to 3 and so one.

---

## Prerequisites

Install [Node.js](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) before you run the Editor.

---

## Run Locally

Once you have the **Node.js** and **npm**, clone the repository from Github:

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

The Editor is a single-page app built with Vite and React Router. Its dependencies install when you run `npm install`. You do not install them separately.

`@seldon/core` and `@seldon/factory` are not tied to the editor. If you build your own editor, you can use any React setup -- or no React at all for headless tooling.

---

Then open `http://localhost:5173` in your browser. You should now have the editor running locally.

---

## Where to go from here

At the time of this writing, Seldon is far from complete. It is missing many features, behaviors, code export languages (like Swift and Java), and a host of other things. But rather than wait until it's all done and build it in a closed environment, we're going to build it out in the open and evolve it based on your feedback. Hopefully many of you will become contributors as well.

There's a lot to do, so we also need feedback on what is working, what is not, and what should be added sooner rather than later. "It's a process," as they say.

By the end of the first year, we expect to have a fairly robust codebase that will be able to do a whole host of things not easily possible today. Even a robust locally run Editor that works as well as anything out there. 

As that begins to take shape, we'll all be able to better see where the future is going, and we fully expect that wasting compute, energy, and money on writing Button code will not be a thing.

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
