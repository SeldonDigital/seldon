import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["seldon/chrome/**", "dist/**", "node_modules/**"]),
  {
    rules: {
      "no-console": [
        "warn",
        {
          allow: [
            "warn",
            "error",
            "info",
            "dir",
            "group",
            "groupCollapsed",
            "groupEnd",
          ],
        },
      ],
    },
  },
])
