import chroma from "chroma-js"

import { isHSLObject } from "../../helpers/type-guards/color/is-hsl-object"
import { isLCHObject } from "../../helpers/type-guards/color/is-lch-object"
import { isRGBObject } from "../../helpers/type-guards/color/is-rgb-object"
import type { ColorSpaceLiteral } from "../../properties/values/shared/exact/color-spaces"
import type { HSL } from "../../properties/values/shared/exact/hsl"

function colorspaceLiteralToChroma(value: ColorSpaceLiteral) {
  if (typeof value === "string") {
    if (!chroma.valid(value)) {
      throw new Error(`Invalid theme color string: ${value}`)
    }
    return chroma(value)
  }
  if (isHSLObject(value)) {
    return chroma.hsl(value.hue, value.saturation / 100, value.lightness / 100)
  }
  if (isRGBObject(value)) {
    return chroma.rgb(value.red, value.green, value.blue)
  }
  if (isLCHObject(value)) {
    return chroma.lch(value.lightness, value.chroma, value.hue)
  }
  throw new Error(`Unsupported color space literal: ${JSON.stringify(value)}`)
}

/**
 * Converts any supported {@link ColorSpaceLiteral} to HSL for harmony / palette math.
 */
export function colorspaceLiteralToHsl(value: ColorSpaceLiteral): HSL {
  const c = colorspaceLiteralToChroma(value)
  const [rawHue, sa, li] = c.hsl()
  const hu = Number.isFinite(rawHue) ? rawHue : 0
  const hue = Math.round(((hu % 360) + 360) % 360)
  const saturation = Math.round(Math.max(0, Math.min(100, (sa ?? 0) * 100)))
  const lightness = Math.round(Math.max(0, Math.min(100, (li ?? 0) * 100)))
  return { hue, saturation, lightness }
}

/**
 * Validates and returns a canonical color space literal. Objects are returned as plain copies;
 * strings are validated via chroma-js and returned unchanged when valid.
 */
export function parseColorspaceLiteral(value: unknown): ColorSpaceLiteral {
  if (value === null || value === undefined) {
    throw new Error("Theme color value is required")
  }
  if (typeof value === "string") {
    if (!chroma.valid(value)) {
      throw new Error(`Invalid theme color string: ${value}`)
    }
    return value
  }
  if (isHSLObject(value)) {
    return {
      hue: value.hue,
      saturation: value.saturation,
      lightness: value.lightness,
    }
  }
  if (isRGBObject(value)) {
    return {
      red: value.red,
      green: value.green,
      blue: value.blue,
    }
  }
  if (isLCHObject(value)) {
    return {
      lightness: value.lightness,
      chroma: value.chroma,
      hue: value.hue,
    }
  }
  throw new Error(
    `Cannot parse theme color: expected hex/css string or HSL, RGB, or LCH object, got ${typeof value}`,
  )
}
