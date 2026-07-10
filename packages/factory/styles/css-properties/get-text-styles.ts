import {
  FontStyle,
  TextAlign,
  TextCasing,
  TextDecoration,
  ValueType,
} from "@seldon/core"
import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import { resolveFontSize } from "@seldon/core/helpers/resolution/resolve-font-size"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { ThemeFont } from "@seldon/core/themes/types"

import { getComputedCssValue } from "../computed-variables"
import { StyleGenerationContext } from "../types"
import { getCssValue } from "./get-css-value"
import { getThemeTokenVarReference } from "./get-theme-token-reference"
import { CSSObject } from "./types"

export function getTextStyles({
  properties,
  computeContext,
  theme,
  useThemeVariableReferences,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}
  const preset = resolveValue(properties.font?.preset)
  const themeFont = preset
    ? (getThemeOption(preset.value, theme) as ThemeFont)
    : undefined

  const family =
    resolveFontFamily({ fontFamily: properties.font?.family, theme }) ||
    resolveFontFamily({ fontFamily: themeFont?.parameters.family, theme })

  const style =
    resolveValue(properties.font?.style) ||
    resolveValue(themeFont?.parameters.style)

  const weight =
    resolveValue(properties.font?.weight) ||
    resolveValue(themeFont?.parameters.weight)

  const size =
    resolveValue(properties.font?.size) ||
    resolveValue(themeFont?.parameters.size)

  const lineHeight =
    resolveValue(properties.font?.lineHeight) ||
    resolveValue(themeFont?.parameters.lineHeight)

  const letterSpacing =
    resolveValue(properties.font?.letterSpacing) ||
    resolveValue(themeFont?.parameters.letterSpacing)

  const textCase =
    resolveValue(properties.font?.textCase) ||
    resolveValue(themeFont?.parameters.textCase)

  const textAlign = resolveValue(properties.textAlign)
  const textDecoration = resolveValue(properties.textDecoration)
  const wrapText = resolveValue(properties.wrapText)
  const lines = resolveValue(properties.lines)

  // An explicit, non-auto text alignment cannot survive `display: -webkit-box`,
  // so it takes precedence over multi-line clamp: the line count is bounded with
  // `max-height` instead, keeping the element a block where `text-align` applies.
  const alignmentIsExplicit = Boolean(
    textAlign && textAlign.value !== TextAlign.AUTO,
  )

  // Only apply if font.family is defined in the schema
  if (family && properties.font?.family) {
    const familyReference =
      useThemeVariableReferences &&
      properties.font.family.type === ValueType.THEME_CATEGORICAL
        ? getThemeTokenVarReference(properties.font.family.value)
        : undefined
    styles.fontFamily = familyReference ?? family.value
  }

  // Only apply if font.style is defined in the schema. Italic emits as
  // `oblique 14deg`: font matching prefers a real oblique or italic face when
  // the family ships one and otherwise synthesizes the 14 degree slant, so the
  // style stays visible in fonts without an italic face.
  if (style && properties.font?.style) {
    styles.fontStyle =
      style.value === FontStyle.ITALIC ? "oblique 14deg" : style.value
  }

  // Only apply if font.weight is defined in the schema
  if (weight && properties.font?.weight) {
    if (weight.type === ValueType.EXACT) {
      styles.fontWeight =
        typeof weight.value === "number" ? weight.value : weight.value.value
    } else if (weight.type === ValueType.THEME_ORDINAL) {
      const reference = useThemeVariableReferences
        ? getThemeTokenVarReference(weight.value)
        : undefined
      if (reference) {
        styles.fontWeight = reference
      } else {
        const themeValue = getThemeOption(weight.value, theme)
        styles.fontWeight = themeValue.parameters.value
      }
    }
  }

  // Only apply if font.size is defined in the schema
  if (size && properties.font?.size) {
    const reference =
      useThemeVariableReferences && size.type === ValueType.THEME_ORDINAL
        ? getThemeTokenVarReference(size.value)
        : undefined

    let fontSize: string | number
    if (reference) {
      fontSize = reference
    } else {
      const resolvedFontSize = resolveFontSize({
        fontSize: size,
        theme,
      })
      fontSize = getCssValue(resolvedFontSize) as string // We're sure that the value is a string since its an EmptyValue, PixelValue or RemValue
    }

    const themed =
      useThemeVariableReferences && computeContext
        ? getComputedCssValue({
            original: computeContext.properties.font?.size,
            context: computeContext,
          })
        : null
    styles.fontSize = themed ?? fontSize
  }

  // `buttonSize` is the element size on the font-size scale. It sets the element
  // `font-size` when the node does not author `font.size`, so em-based geometry
  // (such as the toggle switch track and thumb) scales from the size token.
  if (styles.fontSize === undefined && properties.buttonSize) {
    const buttonSize = resolveValue(properties.buttonSize)
    if (buttonSize && properties.buttonSize.type !== ValueType.EMPTY) {
      const reference =
        useThemeVariableReferences &&
        properties.buttonSize.type === ValueType.THEME_ORDINAL
          ? getThemeTokenVarReference(properties.buttonSize.value)
          : undefined

      if (reference) {
        styles.fontSize = reference
      } else {
        const resolvedButtonSize = resolveFontSize({ fontSize: buttonSize, theme })
        styles.fontSize = getCssValue(resolvedButtonSize) as string
      }
    }
  }

  // Only apply if font.lineHeight is defined in the schema
  if (lineHeight && properties.font?.lineHeight) {
    if (lineHeight.type === ValueType.EXACT) {
      styles.lineHeight = getCssValue(lineHeight)
    } else if (lineHeight.type === ValueType.THEME_ORDINAL) {
      const reference = useThemeVariableReferences
        ? getThemeTokenVarReference(lineHeight.value)
        : undefined
      if (reference) {
        styles.lineHeight = reference
      } else {
        const themeValue = getThemeOption(lineHeight.value, theme)
        styles.lineHeight = themeValue.parameters.value
      }
    }
  }

  if (textAlign && properties.textAlign) {
    // Using start ensures that the text is aligned to the left in LTR and right in RTL
    styles.textAlign =
      textAlign.value === TextAlign.AUTO ? "start" : textAlign.value
  }

  // Only apply if font.letterSpacing is defined in the schema
  if (letterSpacing && properties.font?.letterSpacing) {
    styles.letterSpacing = getCssValue(letterSpacing) as string // We're sure that the value is a string since its an EmptyValue, PixelValue or PercentageValue
  }

  // Only apply if textCase is defined in the schema
  if (textCase && properties.font?.textCase) {
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
        const linesValue =
          typeof lines.value === "number" ? lines.value : lines.value.value

        styles.overflow = "hidden"

        if (alignmentIsExplicit) {
          styles.maxHeight = `${linesValue}lh`
        } else {
          styles.display = "-webkit-box"
          styles.WebkitLineClamp = linesValue
          styles.lineClamp = linesValue
          styles.WebkitBoxOrient = "vertical"
          styles.boxOrient = "vertical"
        }
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
