import { Theme, ThemeFontFamilyKey } from "../../../../themes/types"
import { Workspace } from "../../../../workspace/types"
import { GOOGLE_FONT_FAMILIES, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { StringValue } from "../../shared/exact/string"
import { EmptyValue } from "../../shared/empty/empty"
import { InheritValue } from "../../shared/inherit/inherit"

/** Picks one catalog or bundled font name as an option value. */
export interface FontFamilyOptionValue {
  type: ValueType.OPTION
  value: string
}

/** References a named font family slot from the theme. */
export interface FontFamilyThemeValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeFontFamilyKey
}

/**
 * Resolved font family as a concrete string, stored like a fixed picker choice
 * for downstream CSS (`ValueType.OPTION`).
 */
export type FontFamilyPresetValue = {
  type: ValueType.OPTION
  value: string
}

/** Empty, inherit, theme slot, bundled list entry, or a custom family string (`exact`). */
export type FontFamilyValue =
  | EmptyValue
  | InheritValue
  | StringValue
  | FontFamilyOptionValue
  | FontFamilyThemeValue

/** Validates stored font family values. */
export const fontFamilySchema: PropertySchema = {
  name: "fontFamily",
  description:
    "Sets the typeface from theme slots, the bundled list, or a custom name you type.",
  supports: [
    "empty",
    "inherit",
    "exact",
    "option",
    "themeCategorical",
  ] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) =>
      typeof value === "string" && value.length > 0,
    option: (value: unknown) => {
      if (typeof value !== "string" || value.length === 0) return false
      if (value.startsWith("@fontFamily.")) return true
      return GOOGLE_FONT_FAMILIES.some((f) => f.family === value)
    },
    themeCategorical: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return (Object.keys(theme.fontFamily) as string[]).some(
        (id) => value === `@fontFamily.${id}`,
      )
    },
  },
  presetOptions: (_workspace?: Workspace) => {
    const options = [
      { value: "@fontFamily.primary", name: "Primary" },
      { value: "@fontFamily.secondary", name: "Secondary" },
    ]
    const googleFonts = GOOGLE_FONT_FAMILIES.map((font) => ({
      value: font.family,
      name: font.family,
    }))
    return [...options, ...googleFonts]
  },
  themeCategoricalKeys: (theme: Theme) =>
    (Object.keys(theme.fontFamily) as string[]).map(
      (id) => `@fontFamily.${id}` as ThemeFontFamilyKey,
    ),
}
