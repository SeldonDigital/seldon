import {
  ColorValue,
  EmptyValue,
  PercentageValue,
  ValueType,
} from "@seldon/core"
import { applyBrightness } from "@seldon/core/helpers/color/apply-brightness"
import {
  hexToHSLObject,
  parseHSLString,
  rgbToHSL,
  toHSLString,
} from "@seldon/core/helpers/color/convert-color"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { LCHObjectToString } from "@seldon/core/helpers/color/lch-object-to-string"
import { RGBObjectToString } from "@seldon/core/helpers/color/rgb-object-to-string"
import { resolveColor } from "@seldon/core/helpers/resolution/resolve-color"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { isHSLObject } from "@seldon/core/helpers/type-guards/color/is-hsl-object"
import { isLCHObject } from "@seldon/core/helpers/type-guards/color/is-lch-object"
import { isRGBObject } from "@seldon/core/helpers/type-guards/color/is-rgb-object"
import {
  isHSLString,
  isHex,
  isRGBString,
} from "@seldon/core/helpers/validation"
import { Theme } from "@seldon/core/themes/types"

/**
 * Retrieves the CSS color value based on the provided color value and theme.
 *
 * @param {ColorValue | ForegroundColorValue} params.colorValue - The color value to convert to CSS color.
 * @param {PercentageValue | null} params.opacity - The opacity value to convert to CSS color opacity.
 * @param {Theme} params.theme - The theme object containing color options.
 * @returns The CSS color value.
 */
export function getColorCSSValue({
  color,
  opacity,
  brightness,
  theme,
}: {
  color: ColorValue | EmptyValue
  opacity?: PercentageValue | EmptyValue | number
  brightness?: PercentageValue | EmptyValue
  theme: Theme
}): string {
  const resolvedColor = resolveColor({ color, theme })
  const resolvedOpacity =
    typeof opacity === "number"
      ? opacity
      : (resolveValue(opacity)?.value.value ?? 100)

  const resolvedBrightness =
    typeof brightness === "number"
      ? brightness
      : (resolveValue(brightness)?.value.value ?? 0)

  switch (resolvedColor.type) {
    case ValueType.PRESET:
      return resolvedColor.value
    case ValueType.EMPTY:
      return ""
    case ValueType.EXACT:
      if (typeof resolvedColor.value === "string") {
        if (isHex(resolvedColor.value)) {
          // brightness is undefined or 0: don't convert to HSL
          if (!resolvedBrightness) {
            return resolvedColor.value
          }

          const hsl = hexToHSLObject(resolvedColor.value)
          const correctedHSL = applyBrightness(hsl, resolvedBrightness)
          return HSLObjectToString(correctedHSL, resolvedOpacity)
        } else if (isHSLString(resolvedColor.value)) {
          // brightness is undefined or 0: don't convert to HSL
          if (!resolvedBrightness) {
            return resolvedColor.value
          }

          const hsl = parseHSLString(resolvedColor.value)
          const correctedHSL = applyBrightness(hsl, resolvedBrightness)
          return HSLObjectToString(correctedHSL, resolvedOpacity)
        } else if (isRGBString(resolvedColor.value)) {
          // brightness is undefined or 0: don't convert to HSL
          if (!resolvedBrightness) {
            return resolvedColor.value
          }

          const hslString = toHSLString(resolvedColor.value)
          const hsl = parseHSLString(hslString)
          const correctedHSL = applyBrightness(hsl, resolvedBrightness)
          return HSLObjectToString(correctedHSL, resolvedOpacity)
        } else {
          // Handle invalid color strings gracefully - fall back to transparent
          console.warn(
            `Invalid color string: ${resolvedColor.value}. Falling back to transparent.`,
          )
          return "transparent"
        }
      }

      if (isRGBObject(resolvedColor.value)) {
        // brightness is undefined or 0: don't convert to HSL
        if (!resolvedBrightness) {
          return RGBObjectToString(resolvedColor.value, resolvedOpacity)
        }

        const hsl = rgbToHSL(resolvedColor.value)
        const correctedHSL = applyBrightness(hsl, resolvedBrightness)
        return HSLObjectToString(correctedHSL, resolvedOpacity)
      }

      if (isHSLObject(resolvedColor.value)) {
        try {
          const correctedHSL = applyBrightness(
            resolvedColor.value,
            resolvedBrightness,
          )
          return HSLObjectToString(correctedHSL, resolvedOpacity)
        } catch (error) {
          console.warn(
            `Failed to process HSL object: ${JSON.stringify(resolvedColor.value)}. Falling back to transparent.`,
          )
          return "transparent"
        }
      }

      if (isLCHObject(resolvedColor.value)) {
        try {
          const correctedLCH = applyBrightness(
            resolvedColor.value,
            resolvedBrightness,
          )
          return LCHObjectToString(correctedLCH, resolvedOpacity)
        } catch (error) {
          console.warn(
            `Failed to process LCH object: ${JSON.stringify(resolvedColor.value)}. Falling back to transparent.`,
          )
          return "transparent"
        }
      }

      // Handle invalid exact colors gracefully - fall back to transparent
      console.warn(
        `Invalid exact color: ${JSON.stringify(resolvedColor)}. Falling back to transparent.`,
      )
      return "transparent"
    default:
      // @ts-expect-error - We should never reach this point
      throw new Error(`Invalid color type: ${resolvedColor.type}`)
  }
}
