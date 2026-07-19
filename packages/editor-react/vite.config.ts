import react from "@vitejs/plugin-react"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { agentApiPlugin } from "../editor/vite/agent-api-plugin"
import { exportApiPlugin } from "../editor/vite/export-api-plugin"
import { importWebApiPlugin } from "../editor/vite/import-web-api-plugin"
import { workspaceApiPlugin } from "../editor/vite/workspace-api-plugin"

const editorRoot = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(editorRoot, "../..")
const sharedRoot = path.join(editorRoot, "../editor")
const corePackageRoot = path.join(editorRoot, "../core")
const factoryPackageRoot = path.join(editorRoot, "../factory")
const aiPackageEntry = path.join(editorRoot, "../ai/index.ts")

export default defineConfig(({ mode }) => ({
  root: editorRoot,
  plugins: [
    react(),
    workspaceApiPlugin(),
    exportApiPlugin(),
    agentApiPlugin(),
    importWebApiPlugin(),
  ],
  define: {
    // @seldon/core reads process.env in browser code. Statically replace
    // NODE_ENV so prod/dev branches and dead-code elimination work. A minimal
    // process.env shim in index.html covers any other reads (e.g. DEBUG_MODE),
    // since Vite's define does not reliably replace empty-string keys in dev.
    "process.env.NODE_ENV": JSON.stringify(mode),
    "process.env.DEBUG_MODE": JSON.stringify(process.env.DEBUG_MODE ?? ""),
  },
  resolve: {
    alias: [
      { find: "@app", replacement: path.join(editorRoot, "app") },
      { find: "@seldon/editor", replacement: sharedRoot },
      {
        find: "@seldon/components",
        replacement: path.join(editorRoot, "seldon"),
      },
      { find: "@seldon/core", replacement: corePackageRoot },
      { find: "@seldon/factory", replacement: factoryPackageRoot },
      { find: "@seldon/ai", replacement: aiPackageEntry },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: {
    // Pin the React editor to 5173 so it runs concurrently with the Vue editor
    // on 5174, both sharing the same on-disk workspace store.
    port: 5173,
    strictPort: true,
    // Allow Vite to read the sibling @seldon/core and @seldon/factory source
    // and the hoisted node_modules at the repository root.
    fs: { allow: [repoRoot] },
  },
}))
