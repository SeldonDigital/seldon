import path from "node:path"

import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    // Resolve @seldon/core (and its subpaths) to .ts source, bypassing the
    // package exports map so directory-index files resolve, matching core's
    // own vitest config.
    alias: [
      { find: "@seldon/core", replacement: path.resolve(__dirname, "../core") },
    ],
  },
  test: {
    name: "ai",
    root: __dirname,
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
  },
})
