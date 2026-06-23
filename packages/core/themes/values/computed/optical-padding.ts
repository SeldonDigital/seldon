import type { ThemeComputedGroup } from "./theme-computed-group"

/** Side rhythm ratios for the `OPTICAL_PADDING` compute function. */
export interface OpticalPaddingParameters {
  leftRhythm: number
  rightRhythm: number
  verticalRhythm: number
}

export type ThemeOpticalPadding = ThemeComputedGroup<OpticalPaddingParameters>
