import type { ThemeModulation } from "../modulated/theme-modulation"
import type { ThemeBorderWidthOption } from "../option/theme-border-width-option"

/** `borderWidth` table cell: modulated step or option (e.g. `hairline`). */
export type ThemeBorderWidth = ThemeModulation | ThemeBorderWidthOption
