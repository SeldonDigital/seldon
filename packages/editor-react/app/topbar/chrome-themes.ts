import {
  type ChromeTheme,
  DEFAULT_CHROME_THEME,
  getChromeThemes as buildChromeThemes,
} from "@seldon/editor/lib/chrome/chrome-themes"

/**
 * Editor chrome themes for the React editor.
 *
 * Eagerly imports every exported theme stylesheet so each theme's
 * `[data-theme="{slug}"]` block is present in the document. Setting `data-theme`
 * on the chrome root swaps the interface theme. The canvas never reads these
 * variables.
 *
 * The glob is resolved relative to this file, so it must live in the editor
 * package that owns the generated `seldon/styles` folder, not in the shared
 * framework-neutral lib. The slugs it discovers feed the shared label/sort
 * builder.
 */
const themeStylesheets = import.meta.glob("../../seldon/styles/*.css", {
  eager: true,
})

/** Slugs that have an exported `styles/{slug}.css` file. */
const EXPORTED_SLUGS = Object.keys(themeStylesheets)
  .map((path) => path.match(/([^/]+)\.css$/)?.[1])
  .filter((slug): slug is string => Boolean(slug))

export { type ChromeTheme, DEFAULT_CHROME_THEME }

/** The chrome switcher's themes, one per exported `styles/{slug}.css` file. */
export function getChromeThemes(): ChromeTheme[] {
  return buildChromeThemes(EXPORTED_SLUGS)
}
