import path from "node:path"

import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    // Resolve @seldon/core (and its subpaths) to .ts source, bypassing the
    // package exports map so directory-index files resolve.
    alias: [
      {
        find: "@seldon/core",
        replacement: path.resolve(__dirname, "../core"),
      },
    ],
  },
  test: {
    name: "factory",
    root: __dirname,
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    // No tests authored yet; keep the project ready without failing the run.
    passWithNoTests: true,
    // Coverage is configured once at the repo-root vitest.config.ts so the whole
    // workspace reports to a single /coverage folder.
  },
})
