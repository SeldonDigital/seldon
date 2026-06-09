import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"

// Message shared by the app-layer boundary rules.
const APP_VIEW_BOUNDARY_MESSAGE =
  "app/ should render Views only. Move raw DOM markup into seldon/custom-components/ and consume it from there."

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
  // View boundary: app/ components are binding shells. They should not author
  // raw DOM markup or reach into Model services directly. Warnings for now;
  // these become errors once the migration completes.
  {
    files: ["app/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "JSXOpeningElement[name.name=/^[a-z]/]",
          message: APP_VIEW_BOUNDARY_MESSAGE,
        },
      ],
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
  // Purity boundary: custom-components are pure Views and must not depend on
  // application or model runtime code. Fully migrated, so this is an error.
  {
    files: ["seldon/custom-components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@app/*", "@app/**", "@lib/*", "@lib/**"],
              message:
                "custom-components must stay pure Views. Receive data via props instead of importing app/lib.",
            },
          ],
        },
      ],
    },
  },
  // Completed areas: all raw markup has moved into Views, so the no-raw-markup
  // boundary is enforced as an error here. Other areas stay at warning until
  // their markup is migrated.
  {
    files: ["app/tracking/**/*.tsx", "app/toaster/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^[a-z]/]",
          message: APP_VIEW_BOUNDARY_MESSAGE,
        },
      ],
    },
  },
  // The properties sidebar is fully migrated: no raw markup, no Model service
  // imports. Lock both boundaries as errors so the area cannot regress.
  {
    files: ["app/sidebars/properties/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^[a-z]/]",
          message: APP_VIEW_BOUNDARY_MESSAGE,
        },
      ],
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
