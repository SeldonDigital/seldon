/**
 * Editor chrome themes.
 *
 * Eagerly imports every exported theme stylesheet so each theme's
 * `[data-theme="{slug}"]` block is present in the document, then derives the
 * switcher's option list from the discovered files. Setting `data-theme` on the
 * chrome root swaps the interface theme. The canvas never reads these variables.
 */

const themeStylesheets = import.meta.glob("../../seldon/styles-*.css", {
  eager: true,
})

export interface ChromeTheme {
  slug: string
  label: string
}

/** The slug that answers `:root`, used as the default and the canvas pin. */
export const DEFAULT_CHROME_THEME = "seldon"

function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/** Every exported theme, sorted with the default first, then alphabetically. */
export const CHROME_THEMES: ChromeTheme[] = Object.keys(themeStylesheets)
  .map((path) => path.match(/styles-(.+)\.css$/)?.[1])
  .filter((slug): slug is string => Boolean(slug))
  .sort((a, b) => {
    if (a === DEFAULT_CHROME_THEME) return -1
    if (b === DEFAULT_CHROME_THEME) return 1
    return a.localeCompare(b)
  })
  .map((slug) => ({ slug, label: slugToLabel(slug) }))
