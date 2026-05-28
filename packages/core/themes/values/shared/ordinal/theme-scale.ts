import type { ThemeExact } from "../exact/theme-exact"
import type { ThemeModulation } from "../modulated/theme-modulation"

/** Ordinal scale token: modulated step or exact length / number (`ThemeExact`). */
export type ThemeScaleToken = ThemeModulation | ThemeExact
