/**
 * ESM facade over the CJS `pluralize` package (UMD wrapper, no statically
 * detectable named exports). Loaded via the resolve hook in ../hooks.mjs.
 * If Core starts importing a name that is missing here, the process fails at
 * link time with a clear "does not provide an export" error naming this file
 * — add the export below.
 */
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const pluralize = require("pluralize")

export default pluralize
export const plural = pluralize.plural
export const singular = pluralize.singular
export const isPlural = pluralize.isPlural
export const isSingular = pluralize.isSingular
export const addPluralRule = pluralize.addPluralRule
export const addSingularRule = pluralize.addSingularRule
export const addIrregularRule = pluralize.addIrregularRule
export const addUncountableRule = pluralize.addUncountableRule
