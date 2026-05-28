import { Colorspace } from "../../themes/constants/colorspace"
import type { ThemeSwatch } from "../../themes/types"
import { ValueType } from "../../properties/constants"
import type { ColorValue } from "../../properties/values/appearance/color"
import type { Hex } from "../../properties/values/shared/exact/hex"

/**
 * Builds a typed `ColorValue` (always `ValueType.EXACT`) from a resolved theme swatch, preserving
 * the swatch's authoring colorspace so downstream resolvers and serializers see the original shape.
 */
export function themeSwatchToColorValue(swatch: ThemeSwatch): ColorValue {
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
