import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

// Local rule: `execute` is the action arm of a defineTool config, so a blank
// line separates it from the metadata above it (name, label, description,
// parameters). Autofix inserts the blank line so eslint --fix places it before
// Prettier runs.
const localPlugin = {
  rules: {
    "padding-before-execute": {
      meta: {
        type: "layout",
        fixable: "whitespace",
        schema: [],
        messages: { blankLine: "Expected a blank line before `execute`." },
      },
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode()

        return {
          Property(node) {
            if (node.key.type !== "Identifier" || node.key.name !== "execute") return
            if (node.parent.type !== "ObjectExpression") return

            const index = node.parent.properties.indexOf(node)

            if (index <= 0) return

            const prev = node.parent.properties[index - 1]
            const firstToken = sourceCode.getFirstToken(node)
            const comments = sourceCode.getCommentsBefore(firstToken)
            const startNode = comments.length > 0 ? comments[0] : node
            const linesBetween = startNode.loc.start.line - prev.loc.end.line

            if (linesBetween >= 2) return

            context.report({
              node: node.key,
              messageId: "blankLine",
              fix(fixer) {
                return fixer.insertTextBefore(startNode, "\n".repeat(2 - linesBetween))
              },
            })
          },
        }
      },
    },
  },
}

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
    files: ["**/*.{ts,tsx}"],
    plugins: { local: localPlugin },
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
      curly: ["error", "multi-line"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/member-ordering": ["warn", { default: { optionalityOrder: "required-first" } }],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: ["const", "let"], next: "*" },
        { blankLine: "any", prev: ["const", "let"], next: ["const", "let"] },
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: "block-like", next: "*" },
        { blankLine: "always", prev: "*", next: "block-like" },
      ],
      "local/padding-before-execute": "error",
    },
  },
])
