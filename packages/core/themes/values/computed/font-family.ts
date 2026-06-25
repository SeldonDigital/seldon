import type { ThemeFontFamilyToken } from "../shared/font-stack/theme-font-family-token"
import type { ThemeComputedGroup } from "./theme-computed-group"

/** Primary and secondary font stacks. */
export interface FontFamilyGroupParameters {
  primary: ThemeFontFamilyToken
  secondary: ThemeFontFamilyToken
}

export type ThemeFontFamilyGroup = ThemeComputedGroup<FontFamilyGroupParameters>
