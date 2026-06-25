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
    coverage: {
      provider: "v8",
      include: [
        "components/**",
        "font-collections/**",
        "helpers/**",
        "icon-registry/**",
        "icon-sets/**",
        "properties/**",
        "rules/**",
        "themes/**",
        "utils/**",
        "workspace/**",
      ],
      exclude: [
        "dist/**",
        "**/*.{test,spec}.{ts,tsx}",
        "**/*.json",
        "**/index.ts",
      ],
      // Regression floor only. Set just below the current measured numbers so a
      // drop in coverage fails the run, while new tests are free to raise them.
      thresholds: {
        statements: 28,
        branches: 28,
        functions: 10,
        lines: 28,
      },
    },
  },
})
