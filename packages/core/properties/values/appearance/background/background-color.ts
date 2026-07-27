import { themeTokenRefIsValid } from "../../../../helpers/theme/get-theme-key-components"
import { isValidColor } from "../../../../helpers/validation/color"
import { ComputedFunction } from "../../../constants"
import { Color } from "../color"

import type { Theme } from "../../../../themes/types"
import type { PropertySchema } from "../../../types/schema"
import type { ComputedHighContrastValue } from "../../shared/computed/high-contrast-color"
import type { EmptyValue } from "../../shared/empty/empty"
import type { ColorValue } from "../color"

/** Paint allowed on one background layer, without system high-contrast color rules. */
export type BackgroundColorValue = EmptyValue | Exclude<ColorValue, ComputedHighContrastValue>

/** Validates color storage on one background paint layer. */
export const backgroundColorSchema: PropertySchema = {
  name: "backgroundColor",
  description:
    "Sets the layer's paint from literals, color objects, theme swatches, or values that follow another property.",
  supports: ["empty", "inherit", "exact", "option", "computed", "themeCategorical"] as const,
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
      typeof value === "string" && (Object.values(Color) as string[]).includes(value),
    computed: (value: unknown) => value === ComputedFunction.MATCH_COLOR,
    themeCategorical: (value: unknown, theme?: Theme) =>
      themeTokenRefIsValid(value, theme, "swatch"),
  },
  presetOptions: () => Object.values(Color),
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.swatch),
  computedFunctions: () => [ComputedFunction.MATCH_COLOR],
}
