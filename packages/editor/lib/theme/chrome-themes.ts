/**
 * Editor chrome themes.
 *
 * Eagerly imports every exported theme stylesheet so each theme's
 * `[data-theme="{slug}"]` block is present in the document. Setting `data-theme`
 * on the chrome root swaps the interface theme. The canvas never reads these
 * variables.
 *
 * The switcher's option list comes only from the exported `styles-*.css` files,
 * not from the workspace. Each file contributes one option; its slug is the
 * file suffix and its label is that slug in Title Case.
 */
const themeStylesheets = import.meta.glob("../../seldon/styles-*.css", {
  eager: true,
})

/** Slugs that have an exported `styles-{slug}.css` file. */
const EXPORTED_SLUGS = Object.keys(themeStylesheets)
  .map((path) => path.match(/styles-(.+)\.css$/)?.[1])
  .filter((slug): slug is string => Boolean(slug))

export interface ChromeTheme {
  slug: string
  label: string
}

/** The slug that answers `:root`, used as the default and the canvas pin. */
export const DEFAULT_CHROME_THEME = "seldon"

/** Turns a kebab-case slug into a Title Case label (`sunset-blue` -> `Sunset Blue`). */
function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * The chrome switcher's themes, one per exported `styles-{slug}.css` file. The
 * default `seldon` theme sorts first; the rest follow alphabetically by label.
 */
export function getChromeThemes(): ChromeTheme[] {
  return EXPORTED_SLUGS.map((slug) => ({
    slug,
    label: slugToLabel(slug),
  })).sort((a, b) => {
    if (a.slug === DEFAULT_CHROME_THEME) return -1
    if (b.slug === DEFAULT_CHROME_THEME) return 1
    return a.label.localeCompare(b.label)
  })
}
