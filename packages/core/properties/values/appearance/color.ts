import { themeTokenRefIsValid } from "../../../helpers/theme/get-theme-key-components"
import { isValidColor } from "../../../helpers/validation/color"
import { Theme, ThemeSwatchKey } from "../../../themes/types"
import { ComputedFunction, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedHighContrastValue } from "../shared/computed/high-contrast-color"
import { ComputedMatchColorValue } from "../shared/computed/match-color"
import { EmptyValue } from "../shared/empty/empty"
import { HexValue } from "../shared/exact/hex"
import { HSLValue } from "../shared/exact/hsl"
import { LCHValue } from "../shared/exact/lch"
import { RGBValue } from "../shared/exact/rgb"
import { TransparentValue } from "../shared/option/transparent"

/** Fully transparent paint, using the transparent keyword. */
export enum Color {
  TRANSPARENT = "transparent",
}

/** Stores transparent as an option pick. */
export interface ColorOptionValue {
  type: ValueType.OPTION
  value: Color
}

/** References a named swatch from the theme. */
export interface ColorThemeValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeSwatchKey
}

/** Unset or paint from literals, structured color objects, swatches, transparent, or computed rules. */
export type ColorValue =
  | EmptyValue
  | HexValue
  | HSLValue
  | LCHValue
  | RGBValue
  | TransparentValue
  | ColorOptionValue
  | ColorThemeValue
  | ComputedHighContrastValue
  | ComputedMatchColorValue

export const colorSchema: PropertySchema = {
  name: "color",
  description:
    "Sets the color of text and foreground content using literals, objects, swatches, or computed rules.",
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
