import { BorderCompound } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme, ThemeBorder } from "@seldon/core/themes/types"

import { StyleGenerationContext } from "../types"
import { getBorderWidthCSSValue } from "./get-border-width-css-value"
import { getColorCSSValue } from "./get-color-css-value"
import { CSSObject } from "./types"

type Side = "top" | "right" | "bottom" | "left"

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

const SIDE_COMPOUND_KEY: Record<
  Side,
  "borderTop" | "borderRight" | "borderBottom" | "borderLeft"
> = {
  top: "borderTop",
  right: "borderRight",
  bottom: "borderBottom",
  left: "borderLeft",
}

export function getBorderStyles({
  properties,
  theme,
  useThemeVariableReferences,
}: StyleGenerationContext): CSSObject {
  const styles: CSSObject = {}

  const shorthand = properties.border

  const sides: Side[] = ["top", "right", "bottom", "left"]
  sides.forEach((side) => {
    const sideBorder = properties[SIDE_COMPOUND_KEY[side]]
    Object.assign(
      styles,
      getBorderSideStyles(
        side,
        sideBorder,
        shorthand,
        theme,
        useThemeVariableReferences,
      ),
    )
  })

  return styles
}

/**
 * Resolve the styles for one border side, layering the side compound over the
 * `border` shorthand and finally the theme border preset.
 */
function getBorderSideStyles(
  side: Side,
  sideBorder: BorderCompound | undefined,
  shorthand: BorderCompound | undefined,
  theme: Theme,
  useThemeVariableReferences?: boolean,
): CSSObject {
  const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1)
  const styles: CSSObject = {}

  const preset =
    resolveValue(sideBorder?.preset) || resolveValue(shorthand?.preset)
  const themeBorder: ThemeBorder | undefined = preset
    ? getThemeOption(preset.value, theme)
    : undefined

  const width =
    resolveValue(sideBorder?.width) ||
    resolveValue(shorthand?.width) ||
    resolveValue(themeBorder?.parameters.width)

  if (width) {
    styles[`border${capitalizedSide}Width` as BorderWidthKey] =
      getBorderWidthCSSValue(
        width,
        theme,
        useThemeVariableReferences,
      ) as CSSObject["borderWidth"]
  }

  const style =
    resolveValue(sideBorder?.style) ||
    resolveValue(shorthand?.style) ||
    resolveValue(themeBorder?.parameters.style)

  if (style) {
    styles[`border${capitalizedSide}Style` as BorderSideKey] = style.value
  }

  const color =
    resolveValue(sideBorder?.color) ||
    resolveValue(shorthand?.color) ||
    resolveValue(themeBorder?.parameters.color)

  const brightness =
    resolveValue(sideBorder?.brightness) ||
    resolveValue(shorthand?.brightness) ||
    resolveValue(themeBorder?.parameters.brightness)

  const opacity =
    resolveValue(sideBorder?.opacity) ||
    resolveValue(shorthand?.opacity) ||
    resolveValue(themeBorder?.parameters.opacity)

  if (color) {
    styles[`border${capitalizedSide}Color` as BorderColorKey] =
      getColorCSSValue({
        color,
        brightness,
        opacity,
        theme,
        useThemeVariableReferences,
      })
  }

  return styles
}
