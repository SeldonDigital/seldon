/**
 * Derives the owning board key from a font collection entry id.
 * Ids follow `font-collection-{key}-{suffix}`.
 */
export function fontCollectionBoardKeyFromEntryId(
  fontCollectionId: string,
): string | null {
  const without = fontCollectionId.startsWith("font-collection-")
    ? fontCollectionId.slice("font-collection-".length)
    : null
  if (!without) return null
  const lastDash = without.lastIndexOf("-")
  if (lastDash <= 0) return null
  return without.slice(0, lastDash)
}

/** Removes one dot-path key from a plain overrides object. */
export function deleteFontCollectionOverrideAtPath(
  target: Record<string, unknown>,
  path: string,
): void {
  const keys = path.split(".").filter(Boolean)
  if (keys.length === 0) return
  let cur: Record<string, unknown> = target
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!
    const next = cur[k]
    if (typeof next !== "object" || next === null || Array.isArray(next)) {
      return
    }
    cur = next as Record<string, unknown>
  }
  delete cur[keys[keys.length - 1]!]
}

/** Writes `value` at `path` inside a plain overrides object. */
export function setFontCollectionOverrideAtPath(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const keys = path.split(".").filter(Boolean)
  if (keys.length === 0) return
  let cur: Record<string, unknown> = target
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!
    const next = cur[k]
    if (typeof next !== "object" || next === null || Array.isArray(next)) {
      cur[k] = {}
    }
    cur = cur[k] as Record<string, unknown>
  }
  cur[keys[keys.length - 1]!] = value
}
