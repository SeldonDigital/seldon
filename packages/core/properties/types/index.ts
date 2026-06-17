/**
 * Property **types** for workspace nodes and boards.
 * Top-level keys and categories match `properties/PROPERTIES.md`.
 *
 * File roles:
 * - `properties.ts` — `Properties` document type (composite, parallels `themes/types/theme.ts`)
 * - `property-keys.ts` — `PropertyKey` / sub-property key unions / paths (parallels `themes/types/theme-token-ids.ts`)
 * - `theme-reference-values.ts` — atomic value shapes that carry `@`-keys (pairs with `themes/types/theme-reference-keys.ts`)
 * - `schema.ts` — `PropertySchema` (parallels `themes/types/schema.ts`)
 * - `value*.ts` — atomic / compound / shorthand value-shape unions
 */
export * from "./properties"
export * from "./property-keys"
export * from "./value-compound"
export * from "./value-atomic"
export * from "./value-shorthand"
export * from "./theme-reference-values"
export * from "./value"
export * from "./schema"
