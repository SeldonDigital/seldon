import { ThemeBlurKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

export interface ShadowBlurThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeBlurKey
}

export type ShadowBlurValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ShadowBlurThemeValue

export const shadowBlurSchema: PropertySchema = {
  name: "shadowBlur",
  description: "Shadow blur radius",
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
      if (typeof value === "number" && value >= 0) return true
      return false
    },
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.blur
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.blur),
}
