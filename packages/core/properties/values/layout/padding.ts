import { Theme, ThemePaddingKey } from "../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedMatchValue } from "../shared/computed/match"
import { ComputedOpticalPaddingValue } from "../shared/computed/optical-padding"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** Ordinal reference into the theme padding scale for one side. */
export interface PaddingSideThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemePaddingKey
}

/** Optional spacing on each edge inside the element bounds. */
export interface PaddingValue {
  top?: PaddingSideValue
  right?: PaddingSideValue
  bottom?: PaddingSideValue
  left?: PaddingSideValue
}

/** One side value: unset, px or rem lengths, optical padding, match computed, or a theme step. */
export type PaddingSideValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ComputedOpticalPaddingValue
  | ComputedMatchValue
  | PaddingSideThemeValue

export const paddingSchema: PropertySchema = {
  name: "padding",
  description:
    "Sets inside spacing on each edge using lengths, optical padding, theme steps, or match.",
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
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.padding).map((id) => `@padding.${id}`),
  computedFunctions: () => [
    ComputedFunction.OPTICAL_PADDING,
    ComputedFunction.MATCH,
  ],
}
