import vue from "@vitejs/plugin-vue"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { workspaceApiPlugin } from "../editor/vite/workspace-api-plugin"

const editorRoot = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(editorRoot, "../..")
const sharedRoot = path.join(editorRoot, "../editor")
const corePackageRoot = path.join(editorRoot, "../core")
const factoryPackageRoot = path.join(editorRoot, "../factory")
const aiPackageEntry = path.join(editorRoot, "../ai/index.ts")

// The Vue editor runs on a distinct port so it can run alongside the React
// editor. Both share workspace state through the filesystem workspace store.
export default defineConfig(({ mode }) => ({
  root: editorRoot,
  plugins: [vue(), workspaceApiPlugin()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
    "process.env.DEBUG_MODE": JSON.stringify(process.env.DEBUG_MODE ?? ""),
  },
  resolve: {
    alias: [
      { find: "@app", replacement: path.join(editorRoot, "app") },
      { find: "@lib", replacement: path.join(editorRoot, "lib") },
      { find: "@seldon/editor", replacement: sharedRoot },
      {
        find: "@seldon/components",
        replacement: path.join(editorRoot, "seldon"),
      },
      { find: "@seldon/core", replacement: corePackageRoot },
      { find: "@seldon/factory", replacement: factoryPackageRoot },
      { find: "@seldon/ai", replacement: aiPackageEntry },
    ],
    dedupe: ["vue"],
  },
  server: {
    port: 5174,
    fs: { allow: [repoRoot] },
  },
}))
