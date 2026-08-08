/** Parsed parts of a font-collection family selection key. */
export interface FontCollectionItemKey {
  entryId: string
  slot: string
}

/**
 * Parses a resource item selection key of the form
 * `font-collection:<boardKey>:<entryId>:<slot>` into its font-collection entry
 * id and family slot. Returns null for any other resource or a malformed key.
 */
export function parseFontCollectionItemKey(key: string | null): FontCollectionItemKey | null {
  if (!key) return null

  const parts = key.split(":")

  if (parts.length !== 4 || parts[0] !== "font-collection") return null

  const [, , entryId, slot] = parts

  if (!entryId || !slot) return null

  return { entryId, slot }
}
