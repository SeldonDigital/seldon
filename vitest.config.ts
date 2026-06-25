import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    projects: [
      "packages/core/vitest.config.ts",
      "packages/factory/vitest.config.ts",
    ],
  },
})
