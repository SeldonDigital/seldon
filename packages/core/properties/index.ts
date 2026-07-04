/**
 * Property constants, types, value shapes, schemas, and merge helpers.
 * **Computed resolution** is not re-exported here: import `@seldon/core/properties/compute`
 * or `@seldon/core` (root re-exports `./properties/compute`) so this barrel stays free of
 * import cycles with the compute implementation. See `properties/compute/README.md`.
 */
export * from "./constants"
export * from "./types"
export * from "./values"
export * from "./schemas"
export * from "./helpers"
