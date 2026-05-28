/** Type-level helpers for theme document types (parallels `properties/types/helpers.ts`). */
export type { Restricted } from "../../properties/types/helpers"

/** Custom theme token key convention. Used in any namespace that accepts user-added entries. */
export type ThemeCustomKey = `custom${number}`

/**
 * Theme token table: required reserved keys plus optional `customN` slots.
 *
 * Pass an ID union (which may or may not already include `ThemeCustomKey`).
 * The helper extracts the reserved subset for required keys and adds optional
 * `customN` keys uniformly. Use this for any token namespace that allows
 * user-added entries (everything except `fontFamily`).
 */
export type ThemeTokenTable<TUnion extends string, TCell> = Record<
  Exclude<TUnion, ThemeCustomKey>,
  TCell
> &
  Partial<Record<ThemeCustomKey, TCell>>
