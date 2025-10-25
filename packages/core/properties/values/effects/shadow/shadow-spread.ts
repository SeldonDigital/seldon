import { ThemeSpreadKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

export interface ShadowSpreadThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeSpreadKey
}

export type ShadowSpreadValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ShadowSpreadThemeValue

export const shadowSpreadSchema: PropertySchema = {
  name: "shadowSpread",
  description: "Shadow spread radius",
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
      if (typeof value === "number") return true
      return false
    },
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.spread
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.spread),
}
