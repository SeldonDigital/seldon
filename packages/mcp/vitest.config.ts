import path from "node:path"

import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    // Resolve @seldon/core and @seldon/factory (and their subpaths) to .ts
    // source, bypassing the package exports maps so directory-index files
    // resolve. Mirrors packages/factory/vitest.config.ts.
    alias: [
      {
        find: "@seldon/factory",
        replacement: path.resolve(__dirname, "../factory"),
      },
      {
        find: "@seldon/core",
        replacement: path.resolve(__dirname, "../core"),
      },
    ],
  },
  test: {
    name: "mcp",
    root: __dirname,
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    // The Factory-SSR spike exports a workspace and bundles the generated
    // React with esbuild; allow it room beyond the 5s default.
    testTimeout: 60_000,
    // Coverage is configured once at the repo-root vitest.config.ts so the whole
    // workspace reports to a single /coverage folder.
  },
})
