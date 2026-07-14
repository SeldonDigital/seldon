import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

// Message shared by the app-layer boundary rules.
const APP_VIEW_BOUNDARY_MESSAGE =
  "app/ and lib/ should render Views only. Move raw DOM markup into a reusable View (seldon/ for design components, lib/ for editor chrome), or mark a genuinely hand-authored view as *.bespoke.*, and consume it from there."

export default defineConfig([
  globalIgnores(["seldon/chrome/**", "dist/**", "node_modules/**"]),
  // Parse TypeScript and JSX. Rules stay opt-in below; the recommended
  // typescript-eslint rulesets are intentionally not enabled here.
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    // Register plugins so existing inline eslint-disable directives resolve.
    // No rules from these sets are enabled here.
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
    },
  },
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
  // Build scripts are CLI tools whose job is to print progress, so console
  // output is expected here.
  {
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
  // The AI turn logger is a purpose-built debug console gated behind the Dev
  // menu's AI Logging toggle. It intentionally uses console.log and
  // console.table to render structured, collapsible turn output.
  {
    files: ["lib/hooks/ai-chat/log-turn.ts"],
    rules: {
      "no-console": "off",
    },
  },
  // ViewModel hooks authored as .tsx (e.g. context providers) may call Model
  // services; the service-import rule targets view components only.
  {
    files: ["app/**/hooks/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // View boundary: app/ and lib/ views are binding shells. A view that authors
  // raw DOM markup or framer-motion markup is bespoke and must be named
  // *.bespoke.*. Hooks, helpers, and use-* modules are logic, not views, so they
  // are exempt. Bespoke views opt out entirely.
  {
    files: ["app/**/*.tsx", "lib/**/*.tsx"],
    ignores: [
      "**/*.bespoke.*",
      "**/hooks/**",
      "**/helpers/**",
      "**/use-*.tsx",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^[a-z]/]",
          message: APP_VIEW_BOUNDARY_MESSAGE,
        },
        {
          selector:
            "JSXOpeningElement[name.type='JSXMemberExpression'][name.object.name='motion']",
          message: APP_VIEW_BOUNDARY_MESSAGE,
        },
      ],
    },
  },
  // Model service boundary: app/ components reach Model services through a
  // ViewModel hook, never directly. Warning globally; error in the fully
  // migrated properties sidebar so it cannot regress.
  {
    files: ["app/**/*.tsx"],
    ignores: ["**/*.bespoke.*"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["@seldon/core/**/services/**"],
              message:
                "Call Model services from a ViewModel hook (use-*.ts), not from a component.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/sidebars/properties/**/*.tsx"],
    ignores: ["**/*.bespoke.*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@seldon/core/**/services/**"],
              message:
                "Call Model services from a ViewModel hook (use-*.ts), not from a component.",
            },
          ],
        },
      ],
    },
  },
])
