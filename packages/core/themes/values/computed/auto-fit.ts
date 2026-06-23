import type { ThemeComputedGroup } from "./theme-computed-group"

/** Default scale factor for the `AUTO_FIT` compute function. */
export interface AutoFitParameters {
  factor: number
}

export type ThemeAutoFit = ThemeComputedGroup<AutoFitParameters>
