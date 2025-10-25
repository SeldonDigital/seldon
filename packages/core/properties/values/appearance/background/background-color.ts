import { isValidColor } from "../../../../helpers/validation/color"
import { Theme } from "../../../../themes/types"
import { PropertySchema } from "../../../types/schema"
import { ComputedHighContrastValue } from "../../shared/computed/high-contrast-color"
import { EmptyValue } from "../../shared/empty/empty"
import { ColorValue } from "../color"

export type BackgroundColorValue =
  | EmptyValue
  | Exclude<ColorValue, ComputedHighContrastValue>

export const backgroundColorSchema: PropertySchema = {
  name: "backgroundColor",
  description: "Background color styling",
  supports: [
    "empty",
    "inherit",
    "exact",
    "preset",
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
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.swatch
    },
  },
  presetOptions: () => ["transparent"],
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.swatch),
}
