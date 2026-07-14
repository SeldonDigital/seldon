/**
 * Hand-curated icon tag corrections (eval review findings). Unlike
 * icon-tags.ts, this file is never auto-generated and never overwritten by
 * `npm run build:icon-tags` — it's the durable home for fixes to icons whose
 * upstream alias/tag data is too sparse to be found by a natural query.
 *
 * Merged with (not replacing) the vendored tags in catalog-search.ts.
 */
export const ICON_TAG_OVERRIDES: Record<string, readonly string[]> = {
  // Carbon's own "search" aliases are function-only ([find, investigate,
  // explore, look]) — no glyph words at all, so "magnifying glass" (a
  // pure paraphrase, no shared vocabulary) can't find it.
  "carbon-search": ["magnifying", "glass", "magnifier", "lens"],
  // Material's "search" aliases include "glass" but not "magnifying" or
  // "magnifier" — one matching word isn't enough for a two-word query.
  "material-search": ["magnifying", "magnifier", "lens"],
}
