/**
 * ESM facade over the CJS `lodash` package (dynamically attached exports the
 * cjs-module-lexer cannot detect). Loaded via the resolve hook in
 * ../hooks.mjs. If Core starts importing a name that is missing here, the
 * process fails at link time with a clear "does not provide an export" error
 * naming this file — add the export below.
 */
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const lodash = require("lodash")

export default lodash
export const isEqual = lodash.isEqual
