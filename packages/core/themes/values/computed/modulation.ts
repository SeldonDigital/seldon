import { Ratio } from "../../constants"
import type { ThemeComputedGroup } from "./theme-computed-group"

/** Modular scale inputs (`modulate` ratio, base font size, base size). */
export interface ModulationParameters {
  ratio: Ratio
  baseFontSize: number
  baseSize: number
}

export type ThemeModulationGroup = ThemeComputedGroup<ModulationParameters>
