import { defineConfig, globalIgnores } from "eslint/config"

import { seldonBase } from "../../eslint.config.base.mjs"

export default defineConfig([
  globalIgnores(["dist/**", "**/dist/**", "node_modules/**"]),
  ...seldonBase,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Ordinal token enums intentionally share values across scales, so this
      // stays a warning while the rest of the baseline is error-clean.
      "@typescript-eslint/no-duplicate-enum-values": "warn",
    },
  },
])
