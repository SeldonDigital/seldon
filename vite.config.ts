import { join } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  root: "./packages/editor",
  build: {
    outDir: "../../dist/editor",
    emptyOutDir: true,
    rollupOptions: {
      input: join(process.cwd(), "./packages/editor/index.html"),
    },
  },
  server: {
    origin: "http://localhost:2300",
    port: 2301,
    hmr: {
      port: 2301,
    },
  },
  plugins: [react()],
})
