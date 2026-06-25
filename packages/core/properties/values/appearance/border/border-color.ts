import { isValidColor } from "../../../../helpers/validation/color"
import { Theme } from "../../../../themes/types"
import { ComputedFunction } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { Color, ColorValue } from "../color"

/** Unset or full element color storage used on border paint. */
export type BorderColorValue = EmptyValue | ColorValue

/** Validates border color storage. */
export const borderColorSchema: PropertySchema = {
  name: "borderColor",
  description:
    "Sets the border's paint from literals, color objects, theme swatches, or computed rules.",
  supports: [
    "empty",
    "inherit",
    "exact",
    "option",
    "computed",
    "themeCategorical",
  ] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (typeof value === "string") {
        return isValidColor(value)
      }
      if (typeof value === "object" && value !== null) {
        const o = value as Record<string, unknown>
        return o.red !== undefined || o.hue !== undefined
      }
      return false
    },
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Color) as string[]).includes(value),
    computed: (value: unknown) =>
      value === ComputedFunction.MATCH_COLOR ||
      value === ComputedFunction.HIGH_CONTRAST_COLOR,
    themeCategorical: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.swatch
    },
  },
  presetOptions: () => Object.values(Color),
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.swatch),
  computedFunctions: () => [
    ComputedFunction.HIGH_CONTRAST_COLOR,
    ComputedFunction.MATCH_COLOR,
  ],
}
