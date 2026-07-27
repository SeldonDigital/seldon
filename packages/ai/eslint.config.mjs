import { defineConfig, globalIgnores } from "eslint/config"

import { seldonBase } from "../../eslint.config.base.mjs"

export default defineConfig([
  globalIgnores(["dist/**", "**/dist/**", "node_modules/**"]),
  ...seldonBase,
])
