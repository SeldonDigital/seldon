import { isComputedFunction } from "../../../helpers/type-guards/value/is-computed-value"
import { Theme, ThemeGapKey } from "../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedMatchValue } from "../shared/computed/match"
import { EmptyValue } from "../shared/empty/empty"
import { PercentageValue } from "../shared/exact/percentage"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** Catalog spacing choice between children when not using fixed lengths or theme steps. */
export enum Gap {
  EVENLY_SPACED = "evenly-spaced",
  NONE = "none",
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
  | PercentageValue
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
    allowed: [Unit.PX, Unit.REM, Unit.PERCENT],
    default: Unit.PX,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "value" in value &&
        "unit" in value &&
        value.value !== undefined &&
        value.unit !== undefined
      )
        return true
      if (typeof value === "number" && value >= 0) return true
      return false
    },
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Gap) as string[]).includes(value),
    computed: (value: unknown) => isComputedFunction(value),
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme) return false
      return typeof value === "string" && value in theme.gap
    },
  },
  presetOptions: () => Object.values(Gap),
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.gap).map((id) => `@gap.${id}`),
  computedFunctions: () => [ComputedFunction.MATCH],
}
