import { ThemeMarginKey } from "../../../themes/types"
import { Theme } from "../../../themes/types"
import { Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

export interface MarginSideThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeMarginKey
}

export interface MarginValue {
  top?: MarginSideValue
  right?: MarginSideValue
  bottom?: MarginSideValue
  left?: MarginSideValue
}

export type MarginSideValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | MarginSideThemeValue

export const marginSchema: PropertySchema = {
  name: "margin",
  description: "Element margin spacing",
  supports: ["empty", "inherit", "exact", "themeOrdinal"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM],
    default: Unit.PX,
    validation: "both",
  },
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
      return value in theme.margin
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.margin),
}
