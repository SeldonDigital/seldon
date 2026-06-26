import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    // Resolve @seldon/core (and its subpaths) to .ts source, bypassing the
    // package exports map so directory-index files like
    // components/catalog/index.ts resolve.
    alias: [{ find: "@seldon/core", replacement: __dirname }],
  },
  test: {
    name: "core",
    root: __dirname,
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    // Coverage is configured once at the repo-root vitest.config.ts so the whole
    // workspace reports to a single /coverage folder.
  },
})
