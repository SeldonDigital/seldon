import { ThemeFontSizeKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../empty/empty"
import { PixelValue } from "../exact/pixel"
import { RemValue } from "../exact/rem"

// ButtonSize uses the font sizes from the theme in order to base size of the icon on the label
export type ButtonSizeValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ButtonSizeThemeValue

export interface ButtonSizeThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontSizeKey
}

export const buttonSizeSchema: PropertySchema = {
  name: "buttonSize",
  description: "Button size based on font size scale",
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
    themeOrdinal: (value: any, theme?: any) => {
      if (!theme) return false
      return value in theme.fontSize
    },
  },
  themeOrdinalKeys: (theme: any) => Object.keys(theme.fontSize),
}
