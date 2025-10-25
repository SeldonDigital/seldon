import { isValidColor } from "../../../../helpers/validation/color"
import { Theme } from "../../../../themes/types"
import { PropertySchema } from "../../../types/schema"
import { ColorValue } from "../../appearance/color"
import { EmptyValue } from "../../shared/empty/empty"

export type ShadowColorValue = EmptyValue | ColorValue

export const shadowColorSchema: PropertySchema = {
  name: "shadowColor",
  description: "Shadow color styling",
  supports: [
    "empty",
    "inherit",
    "exact",
    "preset",
    "computed",
    "themeCategorical",
  ] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => {
      // For string values, use comprehensive validation
      if (typeof value === "string") {
        return isValidColor(value)
      }
      // For object values (RGB/HSL/LCH objects), check structure
      if (
        typeof value === "object" &&
        (value.red !== undefined || value.hue !== undefined)
      )
        return true
      return false
    },
    preset: (value: any) => value === "transparent",
    computed: (value: any) =>
      typeof value === "object" && value.function !== undefined,
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.swatch
    },
  },
  presetOptions: () => ["transparent"],
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.swatch),
}
