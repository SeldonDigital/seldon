import { Theme, ThemeGapKey } from "../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedMatchValue } from "../shared/computed/match"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

export enum Gap {
  EVENLY_SPACED = "evenly-spaced",
}

export interface GapPresetValue {
  type: ValueType.PRESET
  value: Gap
}

export interface GapThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeGapKey
}

export type GapValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ComputedMatchValue
  | GapPresetValue
  | GapThemeValue

export const gapSchema: PropertySchema = {
  name: "gap",
  description: "Spacing between elements",
  supports: [
    "empty",
    "inherit",
    "exact",
    "preset",
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
    preset: (value: any) => Object.values(Gap).includes(value),
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
