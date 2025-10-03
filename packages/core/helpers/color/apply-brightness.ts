import { Hex } from "../../properties/values/color/hex"
import { HSL } from "../../properties/values/color/hsl"
import { LCH } from "../../properties/values/color/lch"
import { RGB } from "../../properties/values/color/rgb"
import { isRGBObject } from "../type-guards/color/is-rgb-object"
import { isHex } from "../validation"
import { hexToHSLObject, rgbToHSL } from "./convert-color"

/**
 * Applies brightness to an HSL or LCH object by adjusting the lightness value.
 *
 * @param value - The HSL or LCH object to apply the brightness to
 * @param brightness - The brightness percentage (-100 to 100, where positive values tint toward white, negative values shade toward black)
 * @returns The HSL or LCH object with the brightness applied
 */
export const applyBrightness = <T extends HSL | LCH>(
  value: T,
  brightness: number,
): T => {
  if ("saturation" in value) {
    return {
      lightness: calculateLightness(value.lightness, brightness),
      saturation: value.saturation,
      hue: value.hue,
    } as T
  }

  return {
    lightness: calculateLightness(value.lightness, brightness),
    chroma: value.chroma,
    hue: value.hue,
  } as T
}

/**
 * Applies brightness to any supported color format, converting to HSL as needed.
 *
 * @param value - The color to apply the brightness to (HSL, LCH, RGB, or Hex)
 * @param brightness - The brightness percentage (-100 to 100)
 * @returns The color with the brightness applied, converted to HSL if needed
 */
export const convertAndApplyBrightness = (
  value: HSL | LCH | RGB | Hex,
  brightness: number,
) => {
  if (isRGBObject(value)) {
    return applyBrightness(rgbToHSL(value), brightness)
  }

  if (typeof value === "string" && isHex(value)) {
    return applyBrightness(hexToHSLObject(value), brightness)
  }

  return applyBrightness(value, brightness)
}

/**
 * Calculates the new lightness value based on the brightness percentage.
 *
 * @param lightness - The original lightness value (0-100)
 * @param brightness - The brightness percentage (-100 to 100)
 * @returns The new lightness value (0-100)
 */
const calculateLightness = (lightness: number, brightness: number): number => {
  let result: number

  if (brightness > 0) {
    // Tint: percentage of remaining range to white
    const rangeToWhite = 100 - lightness
    result = lightness + (rangeToWhite * brightness) / 100
  } else {
    // Shade: percentage of range to black
    result = lightness + (lightness * brightness) / 100
  }

  return Math.max(0, Math.min(100, result))
}
