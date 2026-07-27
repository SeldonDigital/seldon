/**
 * Resolves the served license URL for a packaged font family. Licenses are
 * copied into `public/font-licenses/<slug>.txt` by `scripts/copy-font-licenses.mjs`,
 * where the slug matches the family slot id in a font collection.
 */
export function getFontLicenseHref(slot: string): string {
  return `/font-licenses/${encodeURIComponent(slot)}.txt`
}
