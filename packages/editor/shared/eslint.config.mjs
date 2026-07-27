import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"

/**
 * `@seldon/editor` is the shared package consumed by both editors. It is a
 * framework-neutral core. The per-framework binding layers live in
 * `packages/editor-react` and `packages/editor-vue`.
 *
 * All of `lib/` is framework-neutral, so nothing under it may import a Vue- or
 * React-family package, a framework store, or an app-layer (`@app/*`) module.
 * Framework bindings belong in the editor packages, and the core must not
 * silently re-couple to either one.
 */
const VUE_BAN = {
  group: ["vue", "vue/*", "@vue/*", "vue-router", "pinia", "pinia/*", "nuxt"],
  message:
    "@seldon/editor is framework-neutral. Keep Vue-family imports in packages/editor-vue.",
}

const REACT_BAN = {
  group: [
    "react",
    "react/*",
    "react-dom",
    "react-dom/*",
    "react-router",
    "react-router/*",
    "react-hotkeys-hook",
    "zustand",
    "zustand/*",
    "@app/*",
    "@lib/*",
  ],
  message:
    "@seldon/editor is framework-neutral. Import within it relatively; keep React, store, and app-layer bindings in packages/editor-react. The @lib/@app aliases belong to the editor packages.",
}

export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**", "seldon/**"]),
  {
    files: ["lib/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "no-restricted-imports": ["error", { patterns: [VUE_BAN, REACT_BAN] }],
    },
  },
])
