import { join } from "node:path"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const editorHome = join(process.cwd(), "./packages/editor")

export default defineConfig({
  root: editorHome,
  css: {
    postcss: join(process.cwd(), "postcss.config.js"),
  },
  build: {
    assetsDir: "./public",
    outDir: "../../dist/editor",
    emptyOutDir: true,
    rollupOptions: {
      input: join(editorHome, "index.html"),
    },
  },
  server: {
    host: true,
    origin: "http://localhost:2300",
    port: 2301,
    hmr: {
      port: 2301,
    },
  },
  plugins: [react()],
  resolve: {
    conditions: ["seldon-dev"],
    alias: {
      "@components": join(editorHome, "components"),
      "@lib": join(editorHome, "lib"),
      "@types": join(editorHome, "app/types.ts"),
      "@catalog": join(editorHome, "../core/components/catalog"),
      "@seldon/core": join(editorHome, "../core"),
      "@seldon/factory": join(editorHome, "../factory"),
    },
  },
})
