import { ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isBuiltInClearedLookToken } from "@seldon/core/themes/looks"

import { getComputedCssValue } from "../computed-variables"
import { getBorderWidthCSSValue } from "./get-border-width-css-value"
import { applyTransformsToColorReference, getColorCSSValue } from "./get-color-css-value"

import type { StyleGenerationContext } from "../types"
import type { CSSObject } from "./types"
import type { BorderCompound } from "@seldon/core"
import type { Theme, ThemeBorder } from "@seldon/core/themes/types"

type Side = "top" | "right" | "bottom" | "left"

type BorderWidthKey =
  | "borderTopWidth"
  | "borderRightWidth"
  | "borderBottomWidth"
  | "borderLeftWidth"

type BorderSideKey = "borderTopStyle" | "borderRightStyle" | "borderBottomStyle" | "borderLeftStyle"

type BorderColorKey =
  | "borderTopColor"
  | "borderRightColor"
  | "borderBottomColor"
  | "borderLeftColor"

const SIDE_COMPOUND_KEY: Record<Side, "borderTop" | "borderRight" | "borderBottom" | "borderLeft"> =
  {
    top: "borderTop",
    right: "borderRight",
    bottom: "borderBottom",
    left: "borderLeft",
  }

export function getBorderStyles({
  properties,
  computeContext,
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
        computeContext,
      ),
    )
  })

  return styles
}

/**
 * A cleared `@border.none` on `border` does not paint any side. Side compounds
 * stay independent, so they still resolve when that all-sides look is none.
 */
function shorthandAppliesToSides(shorthand: BorderCompound | undefined): boolean {
  const preset = resolveValue(shorthand?.preset)

  if (!preset) return true

  return !isBuiltInClearedLookToken("border", preset.value)
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
  computeContext?: StyleGenerationContext["computeContext"],
): CSSObject {
  const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1)
  const styles: CSSObject = {}
  const inheritShorthand = shorthandAppliesToSides(shorthand)
  const preset =
    resolveValue(sideBorder?.preset) ||
    (inheritShorthand ? resolveValue(shorthand?.preset) : undefined)
  const themeBorder: ThemeBorder | undefined = preset
    ? getThemeOption(preset.value, theme)
    : undefined

  const width =
    resolveValue(sideBorder?.width) ||
    (inheritShorthand ? resolveValue(shorthand?.width) : undefined) ||
    resolveValue(themeBorder?.parameters.width)

  if (width) {
    styles[`border${capitalizedSide}Width` as BorderWidthKey] = getBorderWidthCSSValue(
      width,
      theme,
      useThemeVariableReferences,
    ) as CSSObject["borderWidth"]
  }

  const style =
    resolveValue(sideBorder?.style) ||
    (inheritShorthand ? resolveValue(shorthand?.style) : undefined) ||
    resolveValue(themeBorder?.parameters.style)

  if (style) {
    styles[`border${capitalizedSide}Style` as BorderSideKey] = style.value
  }

  const color =
    resolveValue(sideBorder?.color) ||
    (inheritShorthand ? resolveValue(shorthand?.color) : undefined) ||
    resolveValue(themeBorder?.parameters.color)

  const brightness =
    resolveValue(sideBorder?.brightness) ||
    (inheritShorthand ? resolveValue(shorthand?.brightness) : undefined) ||
    resolveValue(themeBorder?.parameters.brightness)

  const opacity =
    resolveValue(sideBorder?.opacity) ||
    (inheritShorthand ? resolveValue(shorthand?.opacity) : undefined) ||
    resolveValue(themeBorder?.parameters.opacity)

  if (color) {
    const baked = getColorCSSValue({
      color,
      brightness,
      opacity,
      theme,
      useThemeVariableReferences,
    })

    // A computed border color (high contrast) references its theme variable so
    // it follows theme and mode switches; transforms wrap the reference the
    // same way swatch references handle them. The pre-compute cell layers like
    // the resolved value: side compound over shorthand over theme preset,
    // skipping EMPTY cells the same way `resolveValue` does.
    const original = [
      computeContext?.properties[SIDE_COMPOUND_KEY[side]]?.color,
      inheritShorthand ? computeContext?.properties.border?.color : undefined,
      themeBorder?.parameters.color,
    ].find((cell) => !!cell && cell.type !== ValueType.EMPTY)
    const themed =
      useThemeVariableReferences && computeContext
        ? getComputedCssValue({ original, context: computeContext })
        : null

    styles[`border${capitalizedSide}Color` as BorderColorKey] = themed
      ? applyTransformsToColorReference(
          themed,
          brightness?.value.value ?? 0,
          opacity?.value.value ?? 100,
        )
      : baked
  }

  return styles
}
