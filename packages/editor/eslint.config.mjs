import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["app/_components/seldon/**", "dist/**", "node_modules/**"]),
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
