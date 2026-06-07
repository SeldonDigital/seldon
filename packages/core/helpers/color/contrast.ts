import chroma from "chroma-js"
import { ColorValue, EmptyValue, ValueType } from "../../index"
import { isHSLObject } from "../type-guards/color/is-hsl-object"
import { isLCHObject } from "../type-guards/color/is-lch-object"
import { isRGBObject } from "../type-guards/color/is-rgb-object"
import { isHex, isHexWithoutHash } from "../validation"
import { HSLObjectToString } from "./hsl-object-to-string"
import { LCHObjectToString } from "./lch-object-to-string"
import { RGBObjectToString } from "./rgb-object-to-string"

const DARK_COLOR_THRESHOLD = 2.5

/**
 * Determines if a background color is dark based on its contrast ratio with white.
 *
 * @param color - The color to check
 * @param threshold - The contrast ratio threshold (default: 2.5)
 * @returns True if the color is considered dark
 * @throws Error if color is empty or transparent
 */
export function isDarkBackgroundColor(
  color: ColorValue | EmptyValue,
  threshold = DARK_COLOR_THRESHOLD,
) {
  if (color.type === ValueType.EMPTY) {
    throw new Error("Empty color value")
  }

  if (color.type === ValueType.OPTION && color.value === "transparent") {
    throw new Error("Unable to parse transparent color")
  }

  return getContrastRatio(color) > threshold
}

/**
 * Calculates the contrast ratio between white and the given color.
 *
 * @param color - The color to calculate contrast against white
 * @returns The contrast ratio (1.0 to 21.0, where higher values indicate better contrast)
 */
export function getContrastRatio(color: ColorValue) {
  return chroma.contrast("white", toString(color))
}

function toString(color: ColorValue): string {
  if (color.type === ValueType.EXACT) {
    if (isRGBObject(color.value)) {
      return RGBObjectToString(color.value)
    }

    if (isHSLObject(color.value)) {
      return HSLObjectToString(color.value)
    }

    if (isLCHObject(color.value)) {
      return LCHObjectToString(color.value)
    }

    if (isHex(color.value)) {
      return color.value
    }

    if (isHexWithoutHash(color.value)) {
      return `#${color.value}`
    }
  }

  if (color.type === ValueType.OPTION) {
    return color.value
  }

  if (color.type === ValueType.THEME_CATEGORICAL) {
    throw new Error("Theme colors must be converted to RGB, HSL or Hex first")
  }

  throw new Error("Unable to parse color type " + color.type)
}
