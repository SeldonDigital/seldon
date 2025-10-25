import { ThemePaddingKey } from "../../../themes/types"
import { Theme } from "../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedOpticalPaddingValue } from "../shared/computed/optical-padding"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

export interface PaddingSideThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemePaddingKey
}

export interface PaddingValue {
  top?: PaddingSideValue
  right?: PaddingSideValue
  bottom?: PaddingSideValue
  left?: PaddingSideValue
}

export type PaddingSideValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ComputedOpticalPaddingValue
  | PaddingSideThemeValue

export const paddingSchema: PropertySchema = {
  name: "padding",
  description: "Element padding spacing",
  supports: ["empty", "inherit", "exact", "computed", "themeOrdinal"] as const,
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
    computed: (value: any) =>
      typeof value === "object" && value.function !== undefined,
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.padding
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.padding),
  computedFunctions: () => [
    ComputedFunction.OPTICAL_PADDING,
    ComputedFunction.MATCH,
  ],
}
