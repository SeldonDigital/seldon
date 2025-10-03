import { StaticTheme } from "../types"
import { Harmony } from "../types"

/**
 * Generates human-readable names for color swatches based on harmony type.
 *
 * @param swatchId - The swatch identifier (swatch1-4)
 * @param theme - Theme configuration containing harmony and step settings
 * @returns Human-readable name for the swatch
 */
export function getPaletteSwatchName(
  swatchId: "swatch1" | "swatch2" | "swatch3" | "swatch4",
  theme: StaticTheme,
) {
  const step = theme.color.step

  switch (theme.color.harmony) {
    case Harmony.Monochromatic:
      switch (swatchId) {
        case "swatch1":
          return `${step > 0 ? "Tint" : "Shade"} 1`
        case "swatch2":
          return `${step > 0 ? "Tint" : "Shade"} 2`
        case "swatch3":
          return `${step > 0 ? "Tint" : "Shade"} 3`
        case "swatch4":
          return `${step > 0 ? "Tint" : "Shade"} 4`
      }
    case Harmony.Complementary:
      if (step > 0) {
        switch (swatchId) {
          case "swatch1":
            return "Tint"
          case "swatch2":
            return "Complement"
          case "swatch3":
            return "Complement Tint"
          case "swatch4":
            return "Complement Light"
        }
      }

      switch (swatchId) {
        case "swatch1":
          return "Shade"
        case "swatch2":
          return "Complement"
        case "swatch3":
          return "Complement Shade"
        case "swatch4":
          return "Complement Dark"
      }
    case Harmony.SplitComplementary:
    case Harmony.Triadic:
      switch (swatchId) {
        case "swatch1":
        case "swatch3":
          return "Complement"
        case "swatch2":
        case "swatch4":
          return step > 0 ? "Complement Tint" : "Complement Shade"
      }
    case Harmony.Analogous:
      switch (swatchId) {
        case "swatch1":
          return "Complement 1"
        case "swatch2":
          return "Complement 2"
        case "swatch3":
          return "Complement 3"
        case "swatch4":
          return "Complement 4"
      }
    case Harmony.Square:
      if (step > 0) {
        switch (swatchId) {
          case "swatch1":
            return "Tint"
          case "swatch2":
            return "Direct Complement"
          case "swatch3":
            return "Right Complement"
          case "swatch4":
            return "Left Complement"
        }
      }

      switch (swatchId) {
        case "swatch1":
          return "Shade"
        case "swatch2":
          return "Direct Complement"
        case "swatch3":
          return "Right Complement"
        case "swatch4":
          return "Left Complement"
      }
  }
}
