import type { ThemeMode } from "../../constants"
import type { ThemeComputedGroup } from "./theme-computed-group"

/** Light/dark appearance inputs shared by the swatch mode derivation. */
export interface DisplayModeParameters {
  /** Mode the authored colors represent. Export derives the opposite mode. */
  mode: ThemeMode
  /** Chroma shift in percent, -100 through 100, applied to derived opposite-mode colors. */
  chromaChange: number
  /** Lightness shift in percent, -100 through 100, applied to derived opposite-mode colors. */
  lightnessChange: number
}

export type ThemeDisplayMode = ThemeComputedGroup<DisplayModeParameters>
