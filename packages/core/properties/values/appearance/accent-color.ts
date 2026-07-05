import { themeTokenRefIsValid } from "../../../helpers/theme/get-theme-key-components"
import { isValidColor } from "../../../helpers/validation/color"
import { Theme } from "../../../themes/types"
import { ComputedFunction } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { Color } from "./color"

export const accentColorSchema: PropertySchema = {
  name: "accentColor",
  description:
    "Sets the accent color the platform uses on native form controls.",
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
      value === ComputedFunction.HIGH_CONTRAST_COLOR ||
      value === ComputedFunction.MATCH_COLOR,
    themeCategorical: (value: unknown, theme?: Theme) =>
      themeTokenRefIsValid(value, theme, "swatch"),
  },
  presetOptions: () => Object.values(Color),
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.swatch),
  computedFunctions: () => [
    ComputedFunction.HIGH_CONTRAST_COLOR,
    ComputedFunction.MATCH_COLOR,
  ],
}
