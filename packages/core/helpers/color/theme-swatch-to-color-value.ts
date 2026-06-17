import { ValueType } from "../../properties/constants"
import type { Hex, HexValue } from "../../properties/values/shared/exact/hex"
import type { HSLValue } from "../../properties/values/shared/exact/hsl"
import type { LCHValue } from "../../properties/values/shared/exact/lch"
import type { RGBValue } from "../../properties/values/shared/exact/rgb"
import { Colorspace } from "../../themes/constants/colorspace"
import type { ThemeSwatch } from "../../themes/types"

/**
 * Builds a typed EXACT color value from a resolved theme swatch, preserving
 * the swatch's authoring colorspace so downstream resolvers and serializers see the original shape.
 */
export function themeSwatchToColorValue(
  swatch: ThemeSwatch,
): HSLValue | RGBValue | LCHValue | HexValue {
  const { parameters } = swatch
  switch (parameters.colorspace) {
    case Colorspace.HSL:
      return { type: ValueType.EXACT, value: parameters.value }
    case Colorspace.RGB:
      return { type: ValueType.EXACT, value: parameters.value }
    case Colorspace.LCH:
      return { type: ValueType.EXACT, value: parameters.value }
    case Colorspace.HEX:
      return { type: ValueType.EXACT, value: parameters.value as Hex }
    case Colorspace.NAME:
      return { type: ValueType.EXACT, value: parameters.value as Hex }
  }
}
