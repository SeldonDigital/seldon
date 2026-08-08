# @seldon/terminus guide

`@seldon/terminus` is the headless Seldon engine: `@seldon/core` plus
`@seldon/factory` in one install. Use it to load, edit, and export a workspace
from a consumer app with no editor.

Read the [host contract](./host-contract.md) first. It covers how you obtain a
workspace and change it through actions. This guide adds the export step and
shows one end-to-end flow.

## Install

```bash
npm install @seldon/terminus
```

## Load, edit, export

```typescript
import fs from "node:fs"

import { exportWorkspace, loadWorkspace, workspaceReducer } from "@seldon/terminus"

import type { WorkspaceAction } from "@seldon/terminus"

// 1. Load the workspace the Seldon editor saved.
const workspace = loadWorkspace(fs.readFileSync(".seldon/my-app.react.json", "utf8"))

// 2. Drive edits from your own code as typed actions.
const action = {
  type: "set_workspace_label",
  payload: { label: "My Library" },
} as WorkspaceAction
const edited = workspaceReducer(workspace, action)

// 3. Export to framework components.
const files = await exportWorkspace(edited, {
  rootDirectory: process.cwd(),
  target: { framework: "react", styles: "css-properties" },
  output: { componentsFolder: "src/sdn" },
})

// 4. Write the files where you want them.
for (const file of files) {
  const target = new URL(`./${file.path}`, `file://${process.cwd()}/`)
  fs.mkdirSync(new URL(".", target), { recursive: true })
  fs.writeFileSync(
    target,
    typeof file.content === "string" ? file.content : Buffer.from(file.content),
  )
}
```

There is no editor. The host supplies the workspace file and drives every edit.

## Export from the command line

For a plain export with no code, use the `seldon-export` CLI that ships with the
factory:

```bash
npx seldon-export --input .seldon/my-app.react.json --framework vite
```

`--framework` picks the project layout (`none`, `vite`, `next`, and more) and `--platform`
picks the framework. The CLI resolves engine assets from the installed
`@seldon/core`, so it works from any project. Run `seldon-export --help` for
every flag, and see the [factory README](../packages/factory/README.md) for the
full option set.

## What ships at runtime

The published `dist` runs under plain Node from the main entry. Import the public
API from the bare `@seldon/terminus` specifier. A bundler consumer resolves the
same API from source.
