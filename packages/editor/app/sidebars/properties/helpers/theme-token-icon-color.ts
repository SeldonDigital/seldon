import { Theme, ValueType } from "@seldon/core"
import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { isSwatchToken } from "@seldon/core/themes/values"

/**
 * Resolves a theme token path to a CSS color string for swatch icon chips.
 */
export function getThemeTokenIconColor(
  token: string,
  theme?: Theme,
): string | undefined {
  if (!theme || !isThemeValueKey(token)) {
    return undefined
  }

  try {
    const themeValue = getThemeOption(token, theme)
    if (!isSwatchToken(themeValue)) {
      return undefined
    }
    return themeSwatchToCssBackground(themeValue)
  } catch {
    return undefined
  }
}

/**
 * Reads a swatch (or other theme) token from a stored property value for icon display.
 */
export function getThemeTokenIconColorFromPropertyValue(
  propertyValue: unknown,
  theme?: Theme,
): string | undefined {
  if (
    !propertyValue ||
    typeof propertyValue !== "object" ||
    propertyValue === null ||
    !("type" in propertyValue) ||
    !("value" in propertyValue)
  ) {
    return undefined
  }

  const typed = propertyValue as { type: ValueType; value?: unknown }

  if (
    typed.type !== ValueType.THEME_CATEGORICAL &&
    typed.type !== ValueType.THEME_ORDINAL
  ) {
    return undefined
  }

  if (typeof typed.value !== "string") {
    return undefined
  }

  return getThemeTokenIconColor(typed.value, theme)
}

export function isSwatchIconPropertyKey(propertyKey: string): boolean {
  if (propertyKey === "color" || propertyKey === "accentColor") {
    return true
  }
  const facet = propertyKey.split(".").pop()
  return facet === "color" || facet === "startColor" || facet === "endColor"
}
