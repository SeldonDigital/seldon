import { Theme } from "../../../themes/types"
import { ComputedFunction, Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { DimensionValue } from "./dimension"
import { Resize } from "./resize"

/** Vertical edge length using the same value shapes as the shared dimension model. */
export type HeightValue = EmptyValue | DimensionValue

export const heightSchema: PropertySchema = {
  name: "height",
  description:
    "Sets vertical size using lengths, theme scale steps, resize choices, or computed rules.",
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
      if (typeof value === "number" && value > 0) return true
      return false
    },
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Resize) as string[]).includes(value),
    computed: (value: unknown) =>
      typeof value === "object" &&
      value !== null &&
      "function" in value &&
      value.function !== undefined,
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme) return false
      return typeof value === "string" && value in theme.dimension
    },
  },
  presetOptions: () => Object.values(Resize),
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.dimension).map((id) => `@dimension.${id}`),
  computedFunctions: () => [ComputedFunction.AUTO_FIT, ComputedFunction.MATCH],
}
