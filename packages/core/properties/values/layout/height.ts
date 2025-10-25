import { Theme } from "../../../themes/types"
import { ComputedFunction, Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { DimensionValue } from "./dimension"

export type HeightValue = EmptyValue | DimensionValue

export const heightSchema: PropertySchema = {
  name: "height",
  description: "Element height dimension",
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
      if (typeof value === "number" && value > 0) return true
      return false
    },
    preset: (value: any) => typeof value === "string" && value.length > 0,
    computed: (value: any) =>
      typeof value === "object" && value.function !== undefined,
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.dimension
    },
  },
  presetOptions: () => ["fit", "fill"],
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.dimension),
  computedFunctions: () => [ComputedFunction.AUTO_FIT, ComputedFunction.MATCH],
}
