import { isValidColor } from "../../../helpers/validation/color"
import { Theme, ThemeSwatchKey } from "../../../themes/types"
import { ComputedFunction } from "../../constants"
import { ValueType } from "../../constants/value-types"
import { PropertySchema } from "../../types/schema"
import { ComputedHighContrastValue } from "../shared/computed/high-contrast-color"
import { ComputedMatchValue } from "../shared/computed/match"
import { EmptyValue } from "../shared/empty/empty"
import { HexValue } from "../shared/exact/hex"
import { HSLValue } from "../shared/exact/hsl"
import { LCHValue } from "../shared/exact/lch"
import { RGBValue } from "../shared/exact/rgb"
import { TransparentValue } from "../shared/exact/transparent"

export enum Color {
  TRANSPARENT = "transparent",
}

export interface ColorPresetValue {
  type: ValueType.PRESET
  value: Color
}

export interface ColorThemeValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeSwatchKey
}

export type ColorValue =
  | EmptyValue
  | HexValue
  | HSLValue
  | LCHValue
  | RGBValue
  | TransparentValue
  | ColorPresetValue
  | ColorThemeValue
  | ComputedHighContrastValue
  | ComputedMatchValue

export const colorSchema: PropertySchema = {
  name: "color",
  description: "Element color styling",
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
    preset: (value: any) => Object.values(Color).includes(value),
    computed: (value: any) =>
      typeof value === "object" && value.function !== undefined,
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.swatch
    },
  },
  presetOptions: () => Object.values(Color),
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.swatch),
  computedFunctions: () => [
    ComputedFunction.HIGH_CONTRAST_COLOR,
    ComputedFunction.MATCH,
  ],
}
