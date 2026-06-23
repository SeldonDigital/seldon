import type { ThemeComputedGroup } from "./theme-computed-group"

/** Inputs for the `MATCH` compute function. */
export interface MatchColorParameters {
  includeBrightness: boolean
  includeOpacity: boolean
}

export type ThemeMatchColor = ThemeComputedGroup<MatchColorParameters>
