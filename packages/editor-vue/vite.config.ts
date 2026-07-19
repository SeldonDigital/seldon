import vue from "@vitejs/plugin-vue"
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

// The Vue editor runs on a distinct port so it can run alongside the React
// editor. Both share workspace state through the filesystem workspace store.
export default defineConfig(({ mode }) => ({
  root: editorRoot,
  // Both editors serve the same static assets from the shared editor package.
  publicDir: path.join(sharedRoot, "public"),
  plugins: [
    vue(),
    workspaceApiPlugin(),
    exportApiPlugin(),
    importWebApiPlugin(),
    agentApiPlugin(),
  ],
  define: {
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
    dedupe: ["vue"],
  },
  server: {
    port: 5174,
    strictPort: true,
    fs: { allow: [repoRoot] },
  },
}))
