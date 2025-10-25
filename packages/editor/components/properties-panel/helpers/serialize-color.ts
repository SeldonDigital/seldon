import {
  ColorValue,
  EmptyValue,
  Hex,
  LCH,
  RGB,
  ThemeSwatchKey,
  ValueType,
} from "@seldon/core"
import { Color } from "@seldon/core"
import {
  isHSLString,
  isHex,
  isHexWithoutHash,
  isLCHString,
  isRGBString,
  isThemeValueKey,
} from "@seldon/core/helpers/validation"
import { getHSLComponents } from "./get-hsl-components"

/**
 * Extracts red, green, and blue components from a valid RGB string.
 */
function getRGBComponents(rgbString: string): RGB {
  const pattern =
    /^rgb\(\s*(\d{1,3})(\s*,\s*|\s+)(\d{1,3})(\s*,\s*|\s+)(\d{1,3})\s*\)$/i
  const match = pattern.exec(rgbString)

  if (match) {
    const [, red, , green, , blue] = match
    const r = parseInt(red)
    const g = parseInt(green)
    const b = parseInt(blue)

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      const invalidValues = []
      if (r < 0 || r > 255) invalidValues.push(`red: ${r}`)
      if (g < 0 || g > 255) invalidValues.push(`green: ${g}`)
      if (b < 0 || b > 255) invalidValues.push(`blue: ${b}`)
      throw new Error(
        `Invalid RGB string: ${rgbString} - ${invalidValues.join(", ")} must be between 0 and 255`,
      )
    }

    return { red: r, green: g, blue: b }
  }

  throw new Error("Invalid RGB string: " + rgbString)
}

/**
 * Extracts lightness, chroma, and hue components from a valid LCH string.
 */
function getLCHComponents(lchString: string): LCH {
  const pattern =
    /^lch\(\s*(\d+)%?\s*[,]?\s*(\d+(?:\.\d+)?)\s*[,]?\s*(\d+)(deg)?\s*\)$/i
  const match = pattern.exec(lchString)

  if (match) {
    const [, lightness, chroma, hue] = match
    const l = parseInt(lightness)
    const c = parseFloat(chroma)
    const h = parseInt(hue)

    if (l < 0 || l > 100 || c < 0 || c > 150 || h < 0 || h > 360) {
      const invalidValues = []
      if (l < 0 || l > 100) invalidValues.push(`lightness: ${l}`)
      if (c < 0 || c > 150) invalidValues.push(`chroma: ${c}`)
      if (h < 0 || h > 360) invalidValues.push(`hue: ${h}`)
      throw new Error(
        `Invalid LCH string: ${lchString} - ${invalidValues.join(", ")} out of range (lightness: 0-100, chroma: 0-150, hue: 0-360)`,
      )
    }

    return { lightness: l, chroma: c, hue: h }
  }

  throw new Error("Invalid LCH string: " + lchString)
}

/**
 * Serializes a string to a ColorValue or EmptyValue.
 *
 * @param value - The value to serialize.
 * @returns The serialized ColorValue or EmptyValue object.
 * @throws A TypeError if the value cannot be serialized.
 */
export function serializeColor(value: string): ColorValue | EmptyValue {
  if (value === "" || value == "none" || value === "default") {
    return { type: ValueType.EMPTY, value: null }
  }

  if (value === "transparent") {
    return { type: ValueType.PRESET, value: Color.TRANSPARENT }
  }

  if (isThemeValueKey(value)) {
    const themeSection = value.split(".")[0]
    switch (themeSection) {
      case "@swatch":
        return {
          type: ValueType.THEME_CATEGORICAL,
          value: value as ThemeSwatchKey,
        }
      default:
        throw new TypeError("Invalid theme section " + themeSection)
    }
  }

  if (isHSLString(value)) {
    return { type: ValueType.EXACT, value: getHSLComponents(value) }
  }

  if (isRGBString(value)) {
    return { type: ValueType.EXACT, value: getRGBComponents(value) }
  }

  if (isLCHString(value)) {
    return { type: ValueType.EXACT, value: getLCHComponents(value) }
  }

  if (isHex(value)) {
    return { type: ValueType.EXACT, value: value.toUpperCase() as Hex }
  }

  if (isHexWithoutHash(value)) {
    return { type: ValueType.EXACT, value: `#${value.toUpperCase()}` as Hex }
  }

  throw new TypeError("Unable to serialize value for value " + value)
}
