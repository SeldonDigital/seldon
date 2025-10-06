import { BorderValue } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeBorder } from "@seldon/core/themes/types"
import { StyleGenerationContext } from "../types"
import { getBorderWidthCSSValue } from "./get-border-width-css-value"
import { getColorCSSValue } from "./get-color-css-value"
import { CSSObject } from "./types"

type BorderWidthKey =
  | "borderTopWidth"
  | "borderRightWidth"
  | "borderBottomWidth"
  | "borderLeftWidth"

type BorderSideKey =
  | "borderTopStyle"
  | "borderRightStyle"
  | "borderBottomStyle"
  | "borderLeftStyle"

type BorderColorKey =
  | "borderTopColor"
  | "borderRightColor"
  | "borderBottomColor"
  | "borderLeftColor"

export function getBorderStyles({
  properties,
  theme,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  if (!properties.border) {
    return styles
  }

  const preset = resolveValue(properties.border.preset)
  const themeBorder = preset ? getThemeOption(preset.value, theme) : undefined
  const sides = ["top", "right", "bottom", "left"] as const

  sides.forEach((side) => {
    Object.assign(
      styles,
      getBorderSideStyles(side, properties.border!, themeBorder, theme),
    )
  })

  return styles
}

/**
 * Get styles for individual border sides
 */
function getBorderSideStyles(
  side: "top" | "right" | "bottom" | "left",
  border: BorderValue,
  themeBorder: ThemeBorder | undefined,
  theme: Theme,
): CSSObject {
  const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1)
  const styles: CSSObject = {}

  // Border side width
  const width =
    resolveValue(border[`${side}Width`]) ||
    resolveValue(border.width) ||
    resolveValue(themeBorder?.parameters.width)

  // Only apply if border[side]Width is defined in the schema
  if (width && border[`${side}Width`]) {
    styles[`border${capitalizedSide}Width` as BorderWidthKey] =
      getBorderWidthCSSValue(width, theme) as CSSObject["borderWidth"]
  }

  // Border side style
  const style =
    resolveValue(border[`${side}Style`]) ||
    resolveValue(border.style) ||
    resolveValue(themeBorder?.parameters.style)

  // Only apply if border.[side]Style is defined in the schema
  if (style && border[`${side}Style`]) {
    styles[`border${capitalizedSide}Style` as BorderSideKey] = style.value
  }

  // Border side color
  const color =
    resolveValue(border[`${side}Color`]) ||
    resolveValue(border.color) ||
    resolveValue(themeBorder?.parameters.color)

  const brightness =
    resolveValue(border[`${side}Brightness`]) ||
    resolveValue(border.brightness) ||
    resolveValue(themeBorder?.parameters.brightness)

  const opacity =
    resolveValue(border[`${side}Opacity`]) ||
    resolveValue(border.opacity) ||
    resolveValue(themeBorder?.parameters.opacity)

  // Only apply if border.[side]Color is defined in the schema
  if (color && border[`${side}Color`]) {
    styles[`border${capitalizedSide}Color` as BorderColorKey] =
      getColorCSSValue({
        color,
        brightness,
        opacity,
        theme,
      })
  }

  return styles
}
