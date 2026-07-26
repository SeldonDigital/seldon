/**
 * The kinds of object a single click or hover can target. Every selectable
 * canvas element and sidebar row tags itself with one of these plus its id, so
 * one code path resolves selection and highlight for all of them.
 *
 * These are pure type unions with no runtime, kept in their own module so both
 * the React and Vue editors can import them without pulling in the React
 * selection store that `selection-target.ts` depends on.
 */
export type SelectionKind =
  | "node"
  | "board"
  | "theme"
  | "fontCollection"
  | "iconSet"
  | "media"
  | "resourceItem"

/** The unified resource-entry kind used across theme/font/icon/media entries. */
export type ResourceEntryKind = "theme" | "fontCollection" | "iconSet" | "media"
