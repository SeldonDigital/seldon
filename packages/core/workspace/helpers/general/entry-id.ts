/**
 * Resource entry ids follow `{prefix}-{boardKey}-{suffix}`, e.g.
 * `theme-earth-default` or `icon-set-material-8f2k1x9a`. The board key may
 * contain dashes; the suffix is the segment after the last dash.
 */

/** Builds an entry id from its prefix, owning board key, and suffix. */
export function formatEntryId(
  prefix: string,
  boardKey: string,
  suffix: string,
): string {
  return `${prefix}-${boardKey}-${suffix}`
}

/** Derives the owning board key from an entry id, or null when the id does not match the prefix. */
export function boardKeyFromEntryId(
  prefix: string,
  entryId: string,
): string | null {
  const start = `${prefix}-`
  if (!entryId.startsWith(start)) return null
  const rest = entryId.slice(start.length)
  const lastDash = rest.lastIndexOf("-")
  if (lastDash <= 0) return null
  return rest.slice(0, lastDash)
}
