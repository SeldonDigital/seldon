import { ThemeLineHeightKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { NumberValue } from "../../shared/exact/number"
import { PercentageValue } from "../../shared/exact/percentage"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

export interface LineHeightThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeLineHeightKey
}

export type LineHeightValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | NumberValue
  | LineHeightThemeValue

export const lineHeightSchema: PropertySchema = {
  name: "lineHeight",
  description: "Line height for text styling",
  supports: ["empty", "inherit", "exact", "themeOrdinal"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => {
      if (
        typeof value === "object" &&
        value.value !== undefined &&
        value.unit !== undefined
      )
        return true
      if (typeof value === "number" && value > 0) return true
      return false
    },
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.lineHeight
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.lineHeight),
}
