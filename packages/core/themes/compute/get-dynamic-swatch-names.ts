import { Harmony } from "../constants"
import type { ThemePipelineInput } from "../types"
import type { ThemePaletteSlot } from "../values"

/**
 * Generates human-readable display names for the eight palette slots resolved by `computeTheme`.
 *
 * Literal slots (`white`, `gray`, `black`, `primary`) return their fixed label; the four harmony
 * slots (`swatch1`-`swatch4`) are derived from the theme's harmony and step settings (e.g.
 * `Tint`, `Shade`, `Complement`, `Direct Complement`). Centralising all user-facing strings here
 * keeps dynamic swatch labels in a single place for future localisation.
 *
 * @param role - Palette slot to label
 * @param theme - Theme configuration containing harmony and step settings (unused for literal slots)
 * @returns Human-readable name for the slot
 */
export function getDynamicSwatchName(
  role: ThemePaletteSlot,
  theme: ThemePipelineInput,
): string {
  switch (role) {
    case "white":
      return "White"
    case "gray":
      return "Gray"
    case "black":
      return "Black"
    case "primary":
      return "Primary"
  }

  const swatchId = role
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
