/**
 * Editor chrome themes.
 *
 * The switcher's option list comes only from the editor's exported
 * `styles/{slug}.css` files, not from the workspace. Each file contributes one
 * option; its slug is the file name and its label is the stock theme's authored
 * name when the slug matches a stock theme, otherwise the slug in Title Case.
 *
 * Discovering and eagerly loading those stylesheets is build-relative and
 * belongs to each editor package, so the exported slugs are passed in. See the
 * per-editor `chrome-themes` module that globs its own `seldon/styles`.
 */
import { STOCK_THEMES_BY_ID } from "@seldon/core/themes"

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

/** Kebab-case form of a camelCase stock theme id (`ibmCarbon` -> `ibm-carbon`). */
function kebabCase(id: string): string {
  return id.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * Authored theme names keyed by stylesheet slug. Built forward from the stock
 * catalog with the same kebab transformation the factory uses for filenames,
 * so a stock theme's menu label always matches its authored `metadata.name`.
 */
const STOCK_NAMES_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.values(STOCK_THEMES_BY_ID).map((stock) => [
    kebabCase(stock.metadata.id),
    stock.metadata.name,
  ]),
)

/**
 * The chrome switcher's themes, one per exported `styles/{slug}.css` slug. The
 * default `seldon` theme sorts first; the rest follow alphabetically by label.
 *
 * @param slugs - Slugs discovered from the editor's own `seldon/styles` folder
 */
export function getChromeThemes(slugs: string[]): ChromeTheme[] {
  return slugs
    .map((slug) => ({
      slug,
      label: STOCK_NAMES_BY_SLUG[slug] ?? slugToLabel(slug),
    }))
    .sort((a, b) => {
      if (a.slug === DEFAULT_CHROME_THEME) return -1
      if (b.slug === DEFAULT_CHROME_THEME) return 1
      return a.label.localeCompare(b.label)
    })
}
