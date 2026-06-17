import { Theme, ThemeMarginKey } from "../../../themes/types"
import { Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { PercentageValue } from "../shared/exact/percentage"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** Catalog spacing choice for one side when not using a length or theme step. */
export enum Margin {
  NONE = "none",
}

/** Picks one spacing option from the Margin enum for a single side. */
export interface MarginSideOptionValue {
  type: ValueType.OPTION
  value: Margin
}

/** Ordinal reference into the theme margin scale for one side. */
export interface MarginSideThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeMarginKey
}

/** Optional spacing on each edge outside the element bounds. */
export interface MarginValue {
  top?: MarginSideValue
  right?: MarginSideValue
  bottom?: MarginSideValue
  left?: MarginSideValue
}

/** One side value: unset, measured lengths, the catalog option, or a theme margin step. */
export type MarginSideValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | MarginSideOptionValue
  | MarginSideThemeValue

export const marginSchema: PropertySchema = {
  name: "margin",
  description:
    "Sets outside spacing on each edge using lengths, the catalog option, or theme margin steps.",
  supports: ["empty", "inherit", "exact", "option", "themeOrdinal"] as const,
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
      (Object.values(Margin) as string[]).includes(value),
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme) return false
      return typeof value === "string" && value in theme.margin
    },
  },
  presetOptions: () => Object.values(Margin),
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.margin).map((id) => `@margin.${id}`),
}
