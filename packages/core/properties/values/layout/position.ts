import { themeTokenRefIsValid } from "../../../helpers/theme/get-theme-key-components"
import { Theme, ThemeDimensionKey } from "../../../themes/types"
import { Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { PercentageValue } from "../shared/exact/percentage"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** Ordinal reference into the theme dimension scale for one edge offset. */
export interface PositionSideThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeDimensionKey
}

/** Optional offsets from each edge when using positioned layout. */
export interface PositionValue {
  top?: PositionSideValue
  right?: PositionSideValue
  bottom?: PositionSideValue
  left?: PositionSideValue
}

/** One edge offset as unset, a measured length, or a theme dimension step. */
export type PositionSideValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | PositionSideThemeValue

export const positionSchema: PropertySchema = {
  name: "position",
  description:
    "Sets inset offsets on top, right, bottom, and left using lengths or theme dimension steps.",
  supports: ["empty", "inherit", "exact", "themeOrdinal"] as const,
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
      if (typeof value === "number") return true
      return false
    },
    themeOrdinal: (value: unknown, theme?: Theme) =>
      themeTokenRefIsValid(value, theme, "dimension"),
  },
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.dimension).map((id) => `@dimension.${id}`),
}
