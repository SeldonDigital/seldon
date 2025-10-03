import { StaticTheme, Theme } from "../types"
import { getDynamicColors } from "./get-dynamic-colors"
import { getPaletteSwatchName } from "./get-palette-swatch-name"

/**
 * Computes a theme with dynamically generated colors based on color settings.
 *
 * @param theme - Static theme configuration
 * @returns Theme with calculated color swatches
 */
export function computeTheme(theme: StaticTheme): Theme {
  const dynamicColors = getDynamicColors(theme)

  return {
    ...theme,
    swatch: {
      ...theme.swatch,
      white: {
        name: "White",
        intent: "The color white",
        type: "hsl",
        value: dynamicColors.white,
      },
      gray: {
        name: "Gray",
        intent: "The color gray",
        type: "hsl",
        value: dynamicColors.gray,
      },
      black: {
        name: "Black",
        intent: "The color black",
        type: "hsl",
        value: dynamicColors.black,
      },
      primary: {
        name: "Primary",
        intent: "The primary color",
        type: "hsl",
        value: dynamicColors.primary,
      },
      swatch1: {
        name: getPaletteSwatchName("swatch1", theme),
        intent: "A tint of the primary color",
        type: "hsl",
        value: dynamicColors.swatch1,
      },
      swatch2: {
        name: getPaletteSwatchName("swatch2", theme),
        intent: "A tint of the primary color",
        type: "hsl",
        value: dynamicColors.swatch2,
      },
      swatch3: {
        name: getPaletteSwatchName("swatch3", theme),
        intent: "A tint of the primary color",
        type: "hsl",
        value: dynamicColors.swatch3,
      },
      swatch4: {
        name: getPaletteSwatchName("swatch4", theme),
        intent: "A tint of the primary color",
        type: "hsl",
        value: dynamicColors.swatch4,
      },
    },
  }
}
