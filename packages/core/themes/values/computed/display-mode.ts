import type { ThemeMode } from "../../constants"
import type { ThemeComputedGroup } from "./theme-computed-group"

/**
 * Light/dark appearance inputs shared by the swatch mode derivation. `mode` is the mode the authored
 * colors represent, and export derives the opposite mode. `chromaChange` and `lightnessChange` are
 * shifts in percent, -100 through 100, applied to the derived opposite-mode colors.
 */
export interface DisplayModeParameters {
  mode: ThemeMode
  chromaChange: number
  lightnessChange: number
}

export type ThemeDisplayMode = ThemeComputedGroup<DisplayModeParameters>
