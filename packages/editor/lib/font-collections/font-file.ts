/**
 * Resolves the served woff2 URL for a packaged font family variant. Font files
 * are copied into `public/font-files/<slot>/<slot>-<variant>.woff2` by
 * `scripts/copy-font-files.mjs`, where the slot matches the family slot id in a
 * font collection.
 */
export function getFontFileHref(slot: string, variant: string): string {
  const file = encodeURIComponent(`${slot}-${variant}`)
  return `/font-files/${encodeURIComponent(slot)}/${file}.woff2`
}
