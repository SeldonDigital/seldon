import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig([
  globalIgnores(["dist/**", "**/dist/**", "node_modules/**"]),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
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
])
