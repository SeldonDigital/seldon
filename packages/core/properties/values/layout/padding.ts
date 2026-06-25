import { Theme, ThemePaddingKey } from "../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedOpticalPaddingValue } from "../shared/computed/optical-padding"
import { EmptyValue } from "../shared/empty/empty"
import { PercentageValue } from "../shared/exact/percentage"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** Catalog spacing choice for one side when not using a length or theme step. */
export enum Padding {
  NONE = "none",
}

/** Picks one spacing option from the Padding enum for a single side. */
export interface PaddingSideOptionValue {
  type: ValueType.OPTION
  value: Padding
}

/** Ordinal reference into the theme padding scale for one side. */
export interface PaddingSideThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemePaddingKey
}

/** Optional spacing on each edge inside the element bounds. */
export interface PaddingValue {
  top?: PaddingSideValue
  right?: PaddingSideValue
  bottom?: PaddingSideValue
  left?: PaddingSideValue
}

/** One side value: unset, measured lengths, the catalog option, optical padding, or a theme step. */
export type PaddingSideValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | PaddingSideOptionValue
  | ComputedOpticalPaddingValue
  | PaddingSideThemeValue

export const paddingSchema: PropertySchema = {
  name: "padding",
  description:
    "Sets inside spacing on each edge using lengths, the catalog option, optical padding, or theme steps.",
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
      if (typeof value === "number" && value >= 0) return true
      return false
    },
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Padding) as string[]).includes(value),
    computed: (value: unknown) => value === ComputedFunction.OPTICAL_PADDING,
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme) return false
      return typeof value === "string" && value in theme.padding
    },
  },
  presetOptions: () => Object.values(Padding),
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.padding).map((id) => `@padding.${id}`),
  computedFunctions: () => [ComputedFunction.OPTICAL_PADDING],
}
