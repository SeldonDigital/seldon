import { Colorspace } from "../../themes/constants/colorspace"
import type { ThemeSwatch } from "../../themes/types"
import { isSwatchToken } from "../../themes/values"
import { HSLObjectToString } from "./hsl-object-to-string"

/** CSS background color for a resolved theme swatch cell. */
export function themeSwatchToCssBackground(
  swatch: ThemeSwatch | undefined,
): string | undefined {
  if (!swatch || !isSwatchToken(swatch)) {
    return undefined
  }

  const { parameters } = swatch
  switch (parameters.colorspace) {
    case Colorspace.HSL:
      return HSLObjectToString(parameters.value)
    case Colorspace.HEX:
    case Colorspace.NAME:
      return parameters.value
    case Colorspace.RGB: {
      const { red, green, blue } = parameters.value
      return `rgb(${red} ${green} ${blue})`
    }
    case Colorspace.LCH: {
      const { lightness, chroma, hue } = parameters.value
      return `lch(${lightness} ${chroma} ${hue})`
    }
    default:
      return undefined
  }
}
