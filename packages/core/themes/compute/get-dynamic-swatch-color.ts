import { HSL } from "../../properties/values/shared/exact/hsl"
import { Harmony } from "../constants"
import type { ThemePipelineInput } from "../types"
import { colorspaceLiteralToHsl } from "./colorspaces"

/**
 * Generates all dynamic swatch colors for a theme based on its color settings.
 *
 * @param theme - Stock or complete theme-shaped input
 * @returns Object containing white, gray, black, primary, and swatch colors
 */
export function getDynamicSwatchColors(theme: ThemePipelineInput): {
  white: HSL
  gray: HSL
  black: HSL
  primary: HSL
  swatch1: HSL
  swatch2: HSL
  swatch3: HSL
  swatch4: HSL
} {
  const harmony = theme.colorHarmony.parameters
  const palette = getPalette({
    baseColorHsl: colorspaceLiteralToHsl(harmony.baseColor),
    harmony: harmony.harmony,
    angle: harmony.angle,
    step: harmony.step,
  })

  return {
    white: getWhiteColor(theme),
    gray: getGrayColor(theme),
    black: getBlackColor(theme),
    primary: palette[0],
    swatch1: palette[1],
    swatch2: palette[2],
    swatch3: palette[3],
    swatch4: palette[4],
  }
}

/**
 * Generates a color palette based on its harmony rules and color settings.
 *
 * @param baseColorHsl - Base color as HSL (derive from `ColorSpaceLiteral` via `colorspaceLiteralToHsl` when needed)
 * @param harmony - The color harmony type
 * @param angle - The angle between colors (default: 20)
 * @param step - The lightness step between colors (default: 10)
 * @returns Array of 5 HSL colors following the harmony rules
 */
export function getPalette({
  baseColorHsl: { hue, saturation, lightness },
  harmony,
  angle = 20,
  step = 10,
}: {
  baseColorHsl: HSL
  harmony: Harmony
  angle?: number
  step?: number
}): HSL[] {
  switch (harmony) {
    case Harmony.Complementary:
      return [
        { hue, saturation, lightness },
        { hue, saturation, lightness: lightness + step },
        { hue: mod(hue + 180), saturation, lightness },
        { hue: mod(hue + 180), saturation, lightness: lightness + step },
        { hue: mod(hue + 180), saturation, lightness: lightness + step * 2 },
      ]
    case Harmony.SplitComplementary:
      return [
        { hue, saturation, lightness },
        { hue: mod(hue + (180 + angle)), saturation, lightness },
        {
          hue: mod(hue + (180 + angle)),
          saturation,
          lightness: lightness + step,
        },
        { hue: mod(hue + (180 - angle)), saturation, lightness },
        {
          hue: mod(hue + (180 - angle)),
          saturation,
          lightness: lightness + step,
        },
      ]

    case Harmony.Triadic:
      return [
        { hue, saturation, lightness },
        { hue: mod(hue + 120), saturation, lightness },
        { hue: mod(hue + 120), saturation, lightness: lightness + step },
        { hue: mod(hue - 120), saturation, lightness },
        { hue: mod(hue - 120), saturation, lightness: lightness + step },
      ]

    case Harmony.Analogous:
      return [
        { hue, saturation, lightness },
        { hue: mod(hue + angle), saturation, lightness },
        { hue: mod(hue + angle * 2), saturation, lightness },
        { hue: mod(hue - angle), saturation, lightness },
        { hue: mod(hue - angle * 2), saturation, lightness },
      ]
    case Harmony.Square:
      return [
        { hue, saturation, lightness },
        { hue, saturation, lightness: lightness + step },
        { hue: mod(hue + 180), saturation, lightness },
        { hue: mod(hue + 90), saturation, lightness },
        { hue: mod(hue - 90), saturation, lightness },
      ]

    case Harmony.Monochromatic:
      return [
        { hue, saturation, lightness },
        { hue, saturation, lightness: lightness + step },
        { hue, saturation, lightness: lightness + step * 2 },
        { hue, saturation, lightness: lightness + step * 3 },
        { hue, saturation, lightness: lightness + step * 4 },
      ]
  }
}

function mod(hue: number): number {
  return (hue + 360) % 360
}

/**
 * Generates white color with subtle hue bleed from base color.
 * @param theme - Theme configuration
 * @returns HSL white color
 */
function getWhiteColor(theme: ThemePipelineInput): HSL {
  const harmony = theme.colorHarmony.parameters
  const { hue } = colorspaceLiteralToHsl(harmony.baseColor)
  return {
    hue,
    saturation: harmony.bleed,
    lightness: harmony.whitePoint,
  }
}

/**
 * Generates gray color with subtle hue bleed from base color.
 * @param theme - Theme configuration
 * @returns HSL gray color
 */
function getGrayColor(theme: ThemePipelineInput): HSL {
  const harmony = theme.colorHarmony.parameters
  const { hue } = colorspaceLiteralToHsl(harmony.baseColor)
  return {
    hue,
    saturation: harmony.bleed,
    lightness: harmony.grayPoint,
  }
}

/**
 * Generates black color with subtle hue bleed from base color.
 * @param theme - Theme configuration
 * @returns HSL black color
 */
function getBlackColor(theme: ThemePipelineInput): HSL {
  const harmony = theme.colorHarmony.parameters
  const { hue } = colorspaceLiteralToHsl(harmony.baseColor)
  return {
    hue,
    saturation: harmony.bleed,
    lightness: harmony.blackPoint,
  }
}
