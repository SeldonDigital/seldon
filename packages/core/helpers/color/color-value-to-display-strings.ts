import chroma from "chroma-js"

import { ValueType } from "../../properties/constants/shared/value-types"
import type { HSL } from "../../properties/values/shared/exact/hsl"
import { isHSLObject } from "../type-guards/color/is-hsl-object"
import { isLCHObject } from "../type-guards/color/is-lch-object"
import { isRGBObject } from "../type-guards/color/is-rgb-object"
import { HSLObjectToString } from "./hsl-object-to-string"

type ResolvedColorValue = {
  type: ValueType
  value: unknown
}

function chromaToHsl(color: chroma.Color): HSL {
  const [rawHue, saturation, lightness] = color.hsl()
  const hue = Number.isFinite(rawHue) ? rawHue : 0
  return {
    hue: Math.round(((hue % 360) + 360) % 360),
    saturation: Math.round((saturation ?? 0) * 100),
    lightness: Math.round((lightness ?? 0) * 100),
  }
}

/**
 * Converts a resolved swatch color into the display strings a color chip spec
 * sheet shows: the HEX form and the HSL form. An authored HSL object is kept
 * verbatim for the HSL string so it reads as the theme authored it; other
 * colorspaces round-trip through chroma. Returns null when the color is unset
 * or cannot be parsed.
 */
export function colorValueToDisplayStrings(
  color: ResolvedColorValue | null | undefined,
): { hex: string; hsl: string } | null {
  if (!color || color.type !== ValueType.EXACT) {
    return null
  }

  const value = color.value
  let chromaColor: chroma.Color
  let hsl: HSL

  try {
    if (typeof value === "string") {
      chromaColor = chroma(value)
      hsl = chromaToHsl(chromaColor)
    } else if (isHSLObject(value)) {
      hsl = value
      chromaColor = chroma.hsl(
        value.hue,
        value.saturation / 100,
        value.lightness / 100,
      )
    } else if (isRGBObject(value)) {
      chromaColor = chroma.rgb(value.red, value.green, value.blue)
      hsl = chromaToHsl(chromaColor)
    } else if (isLCHObject(value)) {
      chromaColor = chroma.lch(value.lightness, value.chroma, value.hue)
      hsl = chromaToHsl(chromaColor)
    } else {
      return null
    }
  } catch {
    return null
  }

  return {
    hex: chromaColor.hex().toUpperCase(),
    hsl: HSLObjectToString(hsl),
  }
}
