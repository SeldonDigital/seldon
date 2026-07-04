import type { EntryTheme } from "../../../model/entry-theme"
import type { ThemeCustomTokenSection } from "../../types"

function readSectionBag(
  entry: EntryTheme,
  section: ThemeCustomTokenSection,
): Record<string, unknown> {
  const current = (entry.overrides as Record<string, unknown>)[section]
  if (
    typeof current !== "object" ||
    current === null ||
    Array.isArray(current)
  ) {
    return {}
  }
  return { ...(current as Record<string, unknown>) }
}

/** Writes `cell` under `id` in `entry.overrides[section]`. Mutates `entry`. */
export function appendCustomToken(
  entry: EntryTheme,
  section: ThemeCustomTokenSection,
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
  section: ThemeCustomTokenSection,
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
