import react from "@vitejs/plugin-react"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { exportApiPlugin } from "./vite/export-api-plugin"

const editorRoot = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(editorRoot, "../..")
const corePackageRoot = path.join(editorRoot, "../core")
const factoryPackageRoot = path.join(editorRoot, "../factory")

export default defineConfig(({ mode }) => ({
  root: editorRoot,
  plugins: [react(), exportApiPlugin()],
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
      { find: "@lib", replacement: path.join(editorRoot, "lib") },
      {
        find: "@seldon/components",
        replacement: path.join(editorRoot, "seldon"),
      },
      { find: "@seldon/core", replacement: corePackageRoot },
      { find: "@seldon/factory", replacement: factoryPackageRoot },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: {
    // Allow Vite to read the sibling @seldon/core and @seldon/factory source
    // and the hoisted node_modules at the repository root.
    fs: { allow: [repoRoot] },
  },
}))
