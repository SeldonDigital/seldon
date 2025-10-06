import {
  TextAlignment,
  TextCasing,
  TextDecoration,
  ValueType,
} from "@seldon/core"
import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import { resolveFontSize } from "@seldon/core/helpers/resolution/resolve-font-size"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { ThemeFont } from "@seldon/core/themes/types"
import { StyleGenerationContext } from "../types"
import { getCssValue } from "./get-css-value"
import { CSSObject } from "./types"

export function getTextStyles({
  properties,
  theme,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}
  const preset = resolveValue(properties.font?.preset)
  const themeFont = preset
    ? (getThemeOption(preset.value, theme) as ThemeFont)
    : undefined

  const family =
    resolveValue(properties.font?.family) ||
    resolveFontFamily({ fontFamily: themeFont?.value.family, theme })

  const style =
    resolveValue(properties.font?.style) || resolveValue(themeFont?.value.style)

  const weight =
    resolveValue(properties.font?.weight) ||
    resolveValue(themeFont?.value.weight)

  const size =
    resolveValue(properties.font?.size) || resolveValue(themeFont?.value.size)

  const lineHeight =
    resolveValue(properties.font?.lineHeight) ||
    resolveValue(themeFont?.value.lineHeight)

  const letterSpacing =
    resolveValue(properties.letterSpacing) ||
    resolveValue(themeFont?.value.letterSpacing)

  const textCase =
    resolveValue(properties.textCase) || resolveValue(themeFont?.value.textCase)

  const textAlign = resolveValue(properties.textAlign)
  const textDecoration = resolveValue(properties.textDecoration)
  const wrapText = resolveValue(properties.wrapText)
  const lines = resolveValue(properties.lines)

  // Only apply if font.family is defined in the schema
  if (family && properties.font?.family) {
    styles.fontFamily = family.value
  }

  // Only apply if font.style is defined in the schema
  if (style && properties.font?.style) {
    styles.fontStyle = style.value
    // Only display text in italic if the font supports it
    styles.fontSynthesisStyle = "none"
  }

  // Only apply if font.weight is defined in the schema
  if (weight && properties.font?.weight) {
    if (weight.type === ValueType.EXACT) {
      styles.fontWeight = weight.value.value
    } else if (weight.type === ValueType.THEME_ORDINAL) {
      const themeValue = getThemeOption(weight.value, theme)
      styles.fontWeight = themeValue.value
    }
  }

  // Only apply if font.size is defined in the schema
  if (size && properties.font?.size) {
    const resolvedFontSize = resolveFontSize({
      fontSize: size,
      theme,
    })

    styles.fontSize = getCssValue(resolvedFontSize) as string // We're sure that the value is a string since its an EmptyValue, PixelValue or RemValue
  }

  // Only apply if font.lineHeight is defined in the schema
  if (lineHeight && properties.font?.lineHeight) {
    if (lineHeight.type === ValueType.EXACT) {
      styles.lineHeight = getCssValue(lineHeight)
    } else if (lineHeight.type === ValueType.THEME_ORDINAL) {
      const themeValue = getThemeOption(lineHeight.value, theme)
      styles.lineHeight = themeValue.value
    }
  }

  if (textAlign) {
    // Using start ensures that the text is aligned to the left in LTR and right in RTL
    styles.textAlign =
      textAlign.value === TextAlignment.AUTO ? "start" : textAlign.value
  }

  // Only apply if letterSpacing is defined in the schema
  if (letterSpacing && properties.letterSpacing) {
    styles.letterSpacing = getCssValue(letterSpacing) as string // We're sure that the value is a string since its an EmptyValue, PixelValue or PercentageValue
  }

  // Only apply if textCase is defined in the schema
  if (textCase && properties.textCase) {
    if (textCase.value !== TextCasing.NORMAL) {
      styles.textTransform = textCase.value
    }
  }

  if (wrapText) {
    if (wrapText.value === false) {
      styles.whiteSpace = "nowrap"
      styles.textOverflow = "ellipsis"
      styles.overflow = "hidden"
    } else {
      styles.whiteSpace = "normal"

      if (lines) {
        styles.overflow = "hidden"
        styles.display = "-webkit-box"
        styles.WebkitLineClamp = lines.value
        styles.lineClamp = lines.value
        styles.WebkitBoxOrient = "vertical"
        styles.boxOrient = "vertical"
      }
    }
  }

  if (textDecoration) {
    if (textDecoration.value === TextDecoration.LINE_THROUGH) {
      styles.textDecoration = "line-through"
    } else if (textDecoration.value === TextDecoration.UNDERLINE) {
      styles.textDecoration = "underline"
    }
  }

  return styles
}
