import {
  assertNever,
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
import { debugLog } from "@seldon/core/utils/debug-logger"

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
    case ValueType.OPTION:
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
          debugLog(
            "Factory",
            "getColorCSSValue",
            "Invalid color string, falling back to transparent",
            {
              colorValue: resolvedColor.value,
            },
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
          debugLog(
            "Factory",
            "getColorCSSValue",
            "Failed to process HSL object, falling back to transparent",
            {
              hslObject: JSON.stringify(resolvedColor.value),
              error: error instanceof Error ? error.message : String(error),
            },
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
          debugLog(
            "Factory",
            "getColorCSSValue",
            "Failed to process LCH object, falling back to transparent",
            {
              lchObject: JSON.stringify(resolvedColor.value),
              error: error instanceof Error ? error.message : String(error),
            },
          )
          return "transparent"
        }
      }

      // Handle invalid exact colors gracefully - fall back to transparent
      debugLog(
        "Factory",
        "getColorCSSValue",
        "Invalid exact color, falling back to transparent",
        {
          resolvedColor: JSON.stringify(resolvedColor),
        },
      )
      return "transparent"
    default:
      return assertNever(resolvedColor)
  }
}
