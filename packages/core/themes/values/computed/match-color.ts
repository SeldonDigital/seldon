import type { ThemeComputedGroup } from "./theme-computed-group"

/** Inputs for the `MATCH_COLOR` compute function. */
export interface MatchColorParameters {
  includeBrightness: boolean
  includeOpacity: boolean
}

export type ThemeMatchColor = ThemeComputedGroup<MatchColorParameters>
