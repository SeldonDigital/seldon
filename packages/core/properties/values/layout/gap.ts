import { Theme, ThemeGapKey } from "../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedMatchValue } from "../shared/computed/match"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** Catalog spacing choice between children when not using fixed lengths or theme steps. */
export enum Gap {
  EVENLY_SPACED = "evenly-spaced",
}

/** Picks one spacing option from the Gap enum. */
export interface GapOptionValue {
  type: ValueType.OPTION
  value: Gap
}

/** Ordinal reference into the theme gap scale. */
export interface GapThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeGapKey
}

/** All ways gap may be stored between flex or grid children. */
export type GapValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ComputedMatchValue
  | GapOptionValue
  | GapThemeValue

export const gapSchema: PropertySchema = {
  name: "gap",
  description:
    "Sets space between child elements using px, rem, theme steps, the catalog option, or computed match.",
  supports: [
    "empty",
    "inherit",
    "exact",
    "option",
    "computed",
    "themeOrdinal",
  ] as const,
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
    option: (value: any) => Object.values(Gap).includes(value),
    computed: (value: any) =>
      typeof value === "object" && value.function !== undefined,
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.gap
    },
  },
  presetOptions: () => Object.values(Gap),
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.gap),
  computedFunctions: () => [ComputedFunction.MATCH],
}
