import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

/**
 * Shared ESLint baseline for every @seldon package. A package config imports
 * `seldonBase`, spreads it after its own `globalIgnores`, and then adds only the
 * blocks unique to that package.
 *
 * Rules live on a `files`-scoped block on purpose. A rules block with no `files`
 * matcher contributes settings but never causes ESLint to lint a source file, so
 * splitting parser and rules across unscoped blocks silently lints nothing.
 *
 * Keep package configs limited to `globalIgnores`, this spread, and genuinely
 * package-specific blocks. Do not redefine baseline rules in a package.
 */
export const seldonBaseRules = {
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
  "padding-line-between-statements": [
    "error",
    { blankLine: "always", prev: ["const", "let"], next: "*" },
    { blankLine: "any", prev: ["const", "let"], next: ["const", "let"] },
    { blankLine: "always", prev: "*", next: "return" },
    { blankLine: "always", prev: "block-like", next: "*" },
    { blankLine: "always", prev: "*", next: "block-like" },
  ],
}

export const seldonBase = defineConfig([
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
    files: ["**/*.{ts,tsx}"],
    rules: seldonBaseRules,
  },
])
