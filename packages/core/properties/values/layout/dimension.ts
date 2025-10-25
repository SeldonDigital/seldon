import { Theme } from "../../../themes/types"
import { ValueType } from "../../constants"
import { ComputedFunction } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedAutoFitValue } from "../shared/computed/auto-fit"
import { ComputedMatchValue } from "../shared/computed/match"
import { EmptyValue } from "../shared/empty/empty"
import { PercentageValue } from "../shared/exact/percentage"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"
import { Resize } from "./resize"

export interface DimensionThemeValue {
  type: ValueType.THEME_ORDINAL
  value: string // Theme dimension key
}

export interface DimensionResizePresetValue {
  type: ValueType.PRESET
  value: Resize
}

export type DimensionValue =
  | EmptyValue
  | DimensionThemeValue
  | DimensionResizePresetValue
  | PixelValue
  | RemValue
  | PercentageValue
  | ComputedAutoFitValue
  | ComputedMatchValue

export type DimensionResizeValue =
  | EmptyValue
  | DimensionResizePresetValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue
  | ComputedMatchValue

export const dimensionSchema: PropertySchema = {
  name: "dimension",
  description: "Element dimensions (width, height)",
  supports: [
    "empty",
    "inherit",
    "exact",
    "preset",
    "computed",
    "themeOrdinal",
  ] as const,
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
    preset: (value: any) => Object.values(Resize).includes(value),
    computed: (value: any) =>
      typeof value === "object" && value.function !== undefined,
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.dimension
    },
  },
  presetOptions: () => Object.values(Resize),
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.dimension),
  computedFunctions: () => [ComputedFunction.AUTO_FIT, ComputedFunction.MATCH],
}
