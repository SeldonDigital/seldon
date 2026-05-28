import {
  ColorValue,
  EmptyValue,
  Hex,
  ThemeSwatchKey,
  ValueType,
} from "@seldon/core"
import { Color } from "@seldon/core"
import {
  parseHSLString,
  parseLCHString,
  parseRGBString,
} from "@seldon/core/helpers/color"
import {
  isHSLString,
  isHex,
  isHexWithoutHash,
  isLCHString,
  isRGBString,
  isThemeValueKey,
} from "@seldon/core/helpers/validation"

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
    return { type: ValueType.OPTION, value: Color.TRANSPARENT }
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
    return { type: ValueType.EXACT, value: parseHSLString(value) }
  }

  if (isRGBString(value)) {
    return { type: ValueType.EXACT, value: parseRGBString(value) }
  }

  if (isLCHString(value)) {
    return { type: ValueType.EXACT, value: parseLCHString(value) }
  }

  if (isHex(value)) {
    return { type: ValueType.EXACT, value: value.toUpperCase() as Hex }
  }

  if (isHexWithoutHash(value)) {
    return { type: ValueType.EXACT, value: `#${value.toUpperCase()}` as Hex }
  }

  throw new TypeError("Unable to serialize value for value " + value)
}
