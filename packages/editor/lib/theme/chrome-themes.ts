/**
 * Editor chrome themes.
 *
 * Eagerly imports every exported theme stylesheet so each theme's
 * `[data-theme="{slug}"]` block is present in the document. Setting `data-theme`
 * on the chrome root swaps the interface theme. The canvas never reads these
 * variables.
 *
 * The switcher's option list is derived from the workspace with the same helper
 * the theme selection menu uses (`getThemePickerOptions`), so ordering and
 * labels stay identical to that menu. Each entry is mapped to its exported CSS
 * slug via `getThemeSlug`, keeping only themes that were actually exported.
 */
import { getThemePickerOptions } from "@seldon/core/helpers/properties/properties-bridge"
import type { Workspace } from "@seldon/core/workspace/types"
import { getThemeSlug } from "@seldon/factory/export/css/generation/get-theme-slug"

const themeStylesheets = import.meta.glob("../../seldon/styles-*.css", {
  eager: true,
})

/** Slugs that have an exported `styles-{slug}.css` file. */
const EXPORTED_SLUGS = new Set(
  Object.keys(themeStylesheets)
    .map((path) => path.match(/styles-(.+)\.css$/)?.[1])
    .filter((slug): slug is string => Boolean(slug)),
)

export interface ChromeTheme {
  slug: string
  label: string
}

/** The slug that answers `:root`, used as the default and the canvas pin. */
export const DEFAULT_CHROME_THEME = "seldon"

/**
 * The chrome switcher's themes, in the theme selection menu's order and naming,
 * limited to themes with an exported stylesheet.
 */
export function getChromeThemes(workspace: Workspace): ChromeTheme[] {
  const seen = new Set<string>()
  const themes: ChromeTheme[] = []

  for (const option of getThemePickerOptions({
    workspace,
    allowInherit: false,
  })) {
    const slug = getThemeSlug(option.value, workspace)
    if (!EXPORTED_SLUGS.has(slug) || seen.has(slug)) continue
    seen.add(slug)
    themes.push({ slug, label: option.name })
  }

  return themes
}
