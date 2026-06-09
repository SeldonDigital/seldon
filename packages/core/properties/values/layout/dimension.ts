import { Theme, ThemeDimensionKey } from "../../../themes/types"
import { ComputedFunction, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedAutoFitValue } from "../shared/computed/auto-fit"
import { ComputedMatchValue } from "../shared/computed/match"
import { EmptyValue } from "../shared/empty/empty"
import { PercentageValue } from "../shared/exact/percentage"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"
import { Resize } from "./resize"

/** Ordinal reference into the theme dimension scale for width or height. */
export interface DimensionThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeDimensionKey
}

/** Resize fit or fill choice stored as an option value. */
export interface DimensionResizeOptionValue {
  type: ValueType.OPTION
  value: Resize
}

/** Full set of ways width and height may be stored on a node. */
export type DimensionValue =
  | EmptyValue
  | DimensionThemeValue
  | DimensionResizeOptionValue
  | PixelValue
  | RemValue
  | PercentageValue
  | ComputedAutoFitValue
  | ComputedMatchValue

/** Dimension shapes that exclude theme ordinal picks. */
export type DimensionResizeValue =
  | EmptyValue
  | DimensionResizeOptionValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue
  | ComputedMatchValue

export const dimensionSchema: PropertySchema = {
  name: "dimension",
  description:
    "Length on an element edge using exact units, theme scale steps, resize options, or computed rules.",
  supports: [
    "empty",
    "inherit",
    "exact",
    "option",
    "computed",
    "themeOrdinal",
  ] as const,
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
