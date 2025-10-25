import { Theme, ThemeBorderWidthKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

export enum BorderWidth {
  HAIRLINE = "hairline",
}

export interface BorderWidthHairlineValue {
  type: ValueType.PRESET
  value: BorderWidth.HAIRLINE
}

export interface BorderWidthThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeBorderWidthKey
}

export type BorderWidthValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | BorderWidthHairlineValue
  | BorderWidthThemeValue

export const borderWidthSchema: PropertySchema = {
  name: "borderWidth",
  description: "Border line width",
  supports: ["empty", "inherit", "exact", "preset", "themeOrdinal"] as const,
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
    preset: (value: any) => Object.values(BorderWidth).includes(value),
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.borderWidth
    },
  },
  presetOptions: () => Object.values(BorderWidth),
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.borderWidth),
}
