import { Unit, ValueType } from "../../properties/constants"
import { isSwatchToken, isThemeExactToken } from "../../themes/values"
import { colorValueToDisplayStrings } from "../color/color-value-to-display-strings"
import { themeSwatchToColorValue } from "../color/theme-swatch-to-color-value"
import { resolveFontSize } from "../resolution/resolve-font-size"
import { resolveModulatedOrExactLength } from "../resolution/resolve-length-token"
import { ROOT_FONT_SIZE_PX } from "../resolution/root-font-size"
import { parseThemeRef } from "./get-theme-key-components"
import { getThemeOption } from "./get-theme-option"

import type { EmptyValue, PixelValue, RemValue } from "../../properties/values"
import type { Theme, ThemeFontSizeKey } from "../../themes/types"

/** The font size scale modulates against its own base, so it resolves apart. */
const FONT_SIZE_SECTION = "fontSize"

/**
 * The resolved value behind a theme token, to show beside the token's name. A
 * length reads as the pixels it renders paired with its rem, such as
 * `12px · 0.75rem`. A unitless token reads as its number, a percentage or angle
 * keeps its unit, and a swatch reads as its hex. Returns undefined for a token
 * with no single value to show, such as a look, a font family, or an option
 * token like `@borderWidth.hairline`.
 */
export function getThemeValueAnnotation(key: string, theme: Theme): string | undefined {
  const ref = parseThemeRef(key)

  if (!ref) return undefined

  try {
    const option = getThemeOption(key, theme)

    if (isSwatchToken(option)) {
      return colorValueToDisplayStrings(themeSwatchToColorValue(option))?.hex
    }

    if (isThemeExactToken(option)) {
      const { unit, value } = option.parameters

      if (unit === Unit.NUMBER) return formatNumber(value)

      if (unit === Unit.PERCENT || unit === Unit.DEGREES) {
        return `${formatNumber(value)}${unit}`
      }
    }

    if (ref.section === FONT_SIZE_SECTION) {
      return formatLength(
        resolveFontSize({
          fontSize: { type: ValueType.THEME_ORDINAL, value: key as ThemeFontSizeKey },
          theme,
        }),
      )
    }

    return formatLength(resolveModulatedOrExactLength(option, theme))
  } catch {
    return undefined
  }
}

/** Formats a number to at most two decimals with no trailing zeros. */
function formatNumber(value: number): string {
  return `${Math.round(value * 100) / 100}`
}

/** Formats a rem length to at most three decimals with no trailing zeros. */
function formatRem(value: number): string {
  return `${Math.round(value * 1000) / 1000}`
}

/** Pairs a resolved length's pixel and rem forms, e.g. `12px · 0.75rem`. */
function formatLength(length: PixelValue | RemValue | EmptyValue | undefined): string | undefined {
  if (!length || length.type !== ValueType.EXACT) return undefined

  const { unit, value } = length.value
  const px = unit === Unit.PX ? value : value * ROOT_FONT_SIZE_PX
  const rem = unit === Unit.PX ? value / ROOT_FONT_SIZE_PX : value

  return `${formatNumber(px)}px · ${formatRem(rem)}rem`
}
