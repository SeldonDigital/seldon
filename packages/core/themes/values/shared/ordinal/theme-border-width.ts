import type { ThemeBorderWidthOption } from "../option/theme-border-width-option"
import type { ThemeModulation } from "../modulated/theme-modulation"

/** `borderWidth` table cell: modulated step or option (e.g. `hairline`). */
export type ThemeBorderWidth = ThemeModulation | ThemeBorderWidthOption
