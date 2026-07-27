import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig([
  globalIgnores(["seldon/**", "dist/**", "node_modules/**"]),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
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
      curly: ["error", "multi-line"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/member-ordering": [
        "warn",
        { default: { optionalityOrder: "required-first" } },
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
