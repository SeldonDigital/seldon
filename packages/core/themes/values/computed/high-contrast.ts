import type { ColorValue } from "../../../properties/values/appearance/color"
import type { ThemeComputedGroup } from "./theme-computed-group"

/**
 * Inputs for the `HIGH_CONTRAST_COLOR` compute function. `contrastRatio` is the ratio (1-21) at
 * which text switches from black to white. `fallbackColor` is the reference surface used when the
 * based-on color cannot be resolved. When `includeBleed` is on, high contrast returns the computed
 * `@swatch.white`/`@swatch.black`, which carry color bleed. When off, the engine builds a neutral
 * white or black from the color harmony white/black points with zero saturation.
 */
export interface HighContrastParameters {
  contrastRatio: number
  fallbackColor: ColorValue
  includeBleed: boolean
}

export type ThemeHighContrast = ThemeComputedGroup<HighContrastParameters>
