import { defineConfig, globalIgnores } from "eslint/config"
import { seldonBase } from "../../../eslint.config.base.mjs"

/**
 * `@seldon/editor` is the shared package consumed by both editors. It is a
 * framework-neutral core. The per-framework binding layers live in
 * `packages/editor/apps/react` and `packages/editor/apps/vue`.
 *
 * All of `lib/` is framework-neutral, so nothing under it may import a Vue- or
 * React-family package, a framework store, or an app-layer (`@app/*`) module.
 * Framework bindings belong in the editor apps, and the core must not silently
 * re-couple to either one.
 */
const VUE_BAN = {
  group: ["vue", "vue/*", "@vue/*", "vue-router", "pinia", "pinia/*", "nuxt"],
  message:
    "@seldon/editor is framework-neutral. Keep Vue-family imports in packages/editor/apps/vue.",
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
  ],
  message:
    "@seldon/editor is framework-neutral. Import within it relatively; keep React, store, and app-layer bindings in packages/editor/apps/react. The @app alias belongs to the editor apps.",
}

export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**", "seldon/**"]),
  ...seldonBase,
  {
    files: ["lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [VUE_BAN, REACT_BAN] }],
    },
  },
])
