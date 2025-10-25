import { ThemeFontWeightKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { NumberValue } from "../../shared/exact/number"

export interface FontWeightThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontWeightKey
}

export type FontWeightValue = EmptyValue | NumberValue | FontWeightThemeValue

export const fontWeightSchema: PropertySchema = {
  name: "fontWeight",
  description: "Font weight for text styling",
  supports: ["empty", "inherit", "exact", "themeOrdinal"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) =>
      typeof value === "number" && value >= 100 && value <= 900,
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.fontWeight
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.fontWeight),
}
