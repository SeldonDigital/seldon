import type { FontFamilyEntry } from "../../../../font-collections/types"
import type { EntryFontCollection } from "../../../model/entry-font-collection"

/** Section key under `EntryFontCollection.overrides` that holds user-added families. */
export const FONT_COLLECTION_FAMILY_SECTION = "families" as const

function readFamilies(
  entry: EntryFontCollection,
): Record<string, FontFamilyEntry> {
  const current = (entry.overrides as Record<string, unknown>)[
    FONT_COLLECTION_FAMILY_SECTION
  ]
  if (
    typeof current !== "object" ||
    current === null ||
    Array.isArray(current)
  ) {
    return {}
  }
  return { ...(current as Record<string, FontFamilyEntry>) }
}

/** Returns the next free `familyNN` slot id, starting at `family01`. */
export function getNextCustomFamilyId(entry: EntryFontCollection): string {
  const families = readFamilies(entry)
  const familyIds = Object.keys(families).filter((id) =>
    id.startsWith("family"),
  )
  const highest = familyIds
    .map((id) => parseInt(id.replace("family", ""), 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)
    .at(-1)
  const next = (highest ?? 0) + 1
  return `family${next < 10 ? `0${next}` : next}`
}

/** Writes `family` under `id` in `entry.overrides.families`. Mutates `entry`. */
export function appendCustomFamily(
  entry: EntryFontCollection,
  id: string,
  family: FontFamilyEntry,
): void {
  const families = readFamilies(entry)
  families[id] = family
  const overrides: Record<string, unknown> = {
    ...(entry.overrides as Record<string, unknown>),
  }
  overrides[FONT_COLLECTION_FAMILY_SECTION] = families
  entry.overrides = overrides
}

/** Deletes `id` from `entry.overrides.families`. Mutates `entry`. */
export function removeCustomFamily(
  entry: EntryFontCollection,
  id: string,
): void {
  const families = readFamilies(entry)
  delete families[id]
  const overrides: Record<string, unknown> = {
    ...(entry.overrides as Record<string, unknown>),
  }
  overrides[FONT_COLLECTION_FAMILY_SECTION] = families
  entry.overrides = overrides
}
