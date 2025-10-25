import {
  FontFamilyPresetValue,
  NumberValue,
  PercentageValue,
  PixelValue,
  Properties,
  RemValue,
  TextCaseValue,
  Theme,
  ThemeFont,
} from "@seldon/core"
import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import { resolveFontSize } from "@seldon/core/helpers/resolution/resolve-font-size"
import { resolveFontWeight } from "@seldon/core/helpers/resolution/resolve-font-weight"
import { resolveLineHeight } from "@seldon/core/helpers/resolution/resolve-line-height"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isEmptyValue } from "@seldon/core/helpers/type-guards/value/is-empty-value"
import { FontStyleValue } from "@seldon/core/properties/values/typography/font/font-style"

export function resolveFont(
  properties: Properties,
  theme: Theme,
): {
  fontFamily: FontFamilyPresetValue | undefined
  fontSize: PixelValue | RemValue | undefined
  fontStyle: FontStyleValue | undefined
  lineHeight: PixelValue | RemValue | PercentageValue | NumberValue | undefined
  fontWeight: NumberValue | undefined
  letterSpacing: PixelValue | RemValue | PercentageValue | undefined
  textCase: TextCaseValue | undefined
  fontThemeOption: ThemeFont | undefined
} | null {
  const preset = resolveValue(properties.font?.preset)

  if (!preset) return null

  try {
    const fontThemeOption = getThemeOption(preset.value, theme)
    const { parameters } = fontThemeOption

    const fontSize = resolveFontSize({
      fontSize: parameters.size,
      theme,
    })

    const fontStyle =
      parameters.style && !isEmptyValue(parameters.style)
        ? parameters.style
        : undefined

    const fontWeight = resolveFontWeight({
      fontWeight: parameters.weight,
      theme,
    })

    const lineHeight = parameters.lineHeight
      ? resolveLineHeight({
          lineHeight: parameters.lineHeight,
          theme,
        })
      : undefined

    return {
      fontFamily: resolveFontFamily({ fontFamily: parameters.family, theme }),
      fontStyle,
      fontSize: isEmptyValue(fontSize) ? undefined : fontSize,
      lineHeight:
        lineHeight && !isEmptyValue(lineHeight) ? lineHeight : undefined,
      fontWeight: isEmptyValue(fontWeight) ? undefined : fontWeight,
      letterSpacing:
        parameters.letterSpacing && !isEmptyValue(parameters.letterSpacing)
          ? parameters.letterSpacing
          : undefined,
      textCase:
        parameters.textCase && !isEmptyValue(parameters.textCase)
          ? parameters.textCase
          : undefined,
      fontThemeOption,
    }
  } catch {
    return null
  }
}
