import { Theme } from "../../../../themes/types"
import { GOOGLE_FONT_FAMILIES, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

export interface FontFamilyPresetValue {
  type: ValueType.PRESET
  value: string
}

export interface FontFamilyThemeValue {
  type: ValueType.THEME_CATEGORICAL
  value: "@fontFamily.primary" | "@fontFamily.secondary"
}

export type FontFamilyValue =
  | EmptyValue
  | FontFamilyPresetValue
  | FontFamilyThemeValue

export const fontFamilySchema: PropertySchema = {
  name: "fontFamily",
  description: "Font family for text styling",
  supports: [
    "empty",
    "inherit",
    "exact",
    "preset",
    "themeCategorical",
  ] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => typeof value === "string" && value.length > 0,
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.fontFamily
    },
  },
  presetOptions: (theme?: Theme) => {
    const options = []

    // Add theme font families with descriptive names
    if (theme) {
      options.push(
        {
          value: "@fontFamily.primary",
          name: `${theme.fontFamily.primary} (Primary)`,
        },
        {
          value: "@fontFamily.secondary",
          name: `${theme.fontFamily.secondary} (Secondary)`,
        },
      )
    }

    // Add all Google Fonts
    const googleFonts = GOOGLE_FONT_FAMILIES.map((font) => ({
      value: font.family,
      name: font.family,
    }))

    return [...options, ...googleFonts]
  },
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.fontFamily),
}
