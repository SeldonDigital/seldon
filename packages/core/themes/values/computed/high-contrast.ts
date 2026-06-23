import type { ColorValue } from "../../../properties/values/appearance/color"
import type { ThemeComputedGroup } from "./theme-computed-group"

/** Inputs for the `HIGH_CONTRAST_COLOR` compute function. */
export interface HighContrastParameters {
  /** Contrast ratio (1-21) at which text switches from black to white. */
  contrastRatio: number
  /** Reference surface used when the based-on color cannot be resolved. */
  fallbackColor: ColorValue
  /**
   * When on, high contrast returns the computed `@swatch.white`/`@swatch.black`
   * (which carry color bleed). When off, the engine builds a neutral white or
   * black from the color harmony white/black points with zero saturation.
   */
  includeBleed: boolean
}

export type ThemeHighContrast = ThemeComputedGroup<HighContrastParameters>
