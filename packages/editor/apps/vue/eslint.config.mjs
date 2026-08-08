import { defineConfig, globalIgnores } from "eslint/config"

import { seldonBase } from "../../../../eslint.config.base.mjs"

export default defineConfig([
  globalIgnores(["sdn/**", "dist/**", "node_modules/**"]),
  ...seldonBase,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info", "dir", "group", "groupCollapsed", "groupEnd"],
        },
      ],
    },
  },
  {
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
])
