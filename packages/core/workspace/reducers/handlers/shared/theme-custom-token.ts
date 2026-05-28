import type { EntryTheme } from "../../../model/entry-theme"

/**
 * Custom-token section keys for {@link EntryTheme.overrides}. Every key here corresponds to
 * a token table that accepts user-added `customN` entries per THEMES.md.
 */
export type CustomTokenSection =
  | "swatch"
  | "font"
  | "border"
  | "background"
  | "gradient"
  | "shadow"
  | "scrollbar"
  | "size"
  | "dimension"
  | "margin"
  | "padding"
  | "gap"
  | "corners"
  | "borderWidth"
  | "blur"
  | "spread"
  | "fontSize"
  | "fontWeight"
  | "lineHeight"

function readSectionBag(
  entry: EntryTheme,
  section: CustomTokenSection,
): Record<string, unknown> {
  const current = (entry.overrides as Record<string, unknown>)[section]
  if (typeof current !== "object" || current === null || Array.isArray(current)) {
    return {}
  }
  return { ...(current as Record<string, unknown>) }
}

/** Writes `cell` under `id` in `entry.overrides[section]`. Mutates `entry`. */
export function appendCustomToken(
  entry: EntryTheme,
  section: CustomTokenSection,
  id: string,
  cell: unknown,
): void {
  const bag = readSectionBag(entry, section)
  bag[id] = cell
  const overrides: Record<string, unknown> = {
    ...(entry.overrides as Record<string, unknown>),
  }
  overrides[section] = bag
  entry.overrides = overrides
}

/** Deletes `id` from `entry.overrides[section]`. Mutates `entry`. */
export function removeCustomToken(
  entry: EntryTheme,
  section: CustomTokenSection,
  id: string,
): void {
  const bag = readSectionBag(entry, section)
  delete bag[id]
  const overrides: Record<string, unknown> = {
    ...(entry.overrides as Record<string, unknown>),
  }
  overrides[section] = bag
  entry.overrides = overrides
}
