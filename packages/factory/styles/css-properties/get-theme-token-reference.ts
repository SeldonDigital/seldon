/**
 * Maps a scale or typography theme reference such as `@size.medium` or
 * `@fontWeight.bold` to the matching `var(--sdn-<label>-<key>)` used by the
 * generated theme stylesheet. Every theme file defines these variables under the
 * same unprefixed names, scoped by `[data-theme]`, so a reference swaps with the
 * active theme.
 *
 * Color swatches use `getThemeSwatchVarReference` instead. Kinds absent from the
 * theme stylesheet (for example `dimension`, `blur`, `spread`) return undefined
 * so callers fall back to the resolved literal.
 */
const KIND_TO_CSS_LABEL: Record<string, string> = {
  size: "sizes",
  margin: "margins",
  padding: "paddings",
  gap: "gaps",
  corners: "corners",
  fontSize: "font-size",
  fontWeight: "font-weight",
  lineHeight: "line-height",
  borderWidth: "border-width",
  fontFamily: "font-family",
}

/**
 * Returns a `var(--sdn-<label>-<key>)` reference for a scale or typography theme
 * reference, or undefined when the reference does not name a theme-file token.
 */
export function getThemeTokenVarReference(
  themeReference: unknown,
): string | undefined {
  if (typeof themeReference !== "string" || !themeReference.startsWith("@")) {
    return undefined
  }

  const dotIndex = themeReference.indexOf(".")
  if (dotIndex < 0) return undefined

  const kind = themeReference.slice(1, dotIndex)
  const key = themeReference.slice(dotIndex + 1)
  const label = KIND_TO_CSS_LABEL[kind]
  if (!label || !key) return undefined

  return `var(--sdn-${label}-${key})`
}
