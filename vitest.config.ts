import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    projects: [
      "packages/core/vitest.config.ts",
      "packages/factory/vitest.config.ts",
    ],
    // Coverage is a workspace-wide concern, so configure it once here. Running
    // `npm run coverage` writes a single report to `/coverage` at the repo root
    // and enforces the thresholds below. Per-project config files intentionally
    // do not set coverage. Factory is excluded until it has tests, so its
    // untested source does not drag the floor down.
    coverage: {
      provider: "v8",
      include: [
        "packages/core/components/**",
        "packages/core/font-collections/**",
        "packages/core/helpers/**",
        "packages/core/icon-registry/**",
        "packages/core/icon-sets/**",
        "packages/core/properties/**",
        "packages/core/rules/**",
        "packages/core/themes/**",
        "packages/core/utils/**",
        "packages/core/workspace/**",
      ],
      exclude: [
        "**/dist/**",
        "**/*.{test,spec}.{ts,tsx}",
        "**/*.json",
        "**/*.md",
        "**/*.mjs",
        "**/index.ts",
      ],
      // Regression floor only. Set just below the current measured numbers so a
      // drop in coverage fails the run, while new tests are free to raise them.
      thresholds: {
        statements: 42,
        branches: 64,
        functions: 18,
        lines: 42,
      },
    },
  },
})
