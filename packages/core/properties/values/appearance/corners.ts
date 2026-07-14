import { themeTokenRefIsValid } from "../../../helpers/theme/get-theme-key-components"
import { Theme, ThemeCornersKey } from "../../../themes/types"
import { Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { PercentageValue } from "../shared/exact/percentage"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** Fixed picks for a curved corner look or square corners. */
export enum Corner {
  ROUNDED = "rounded",
  SQUARED = "squared",
}

/** Optional radius or preset for each corner. */
export interface CornersValue {
  topLeft?: CornerValue
  topRight?: CornerValue
  bottomLeft?: CornerValue
  bottomRight?: CornerValue
}

/** Unset, measured lengths, rounded or squared picks, or a theme radius step. */
export type CornerValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | CornerRoundedValue
  | CornerSquaredValue
  | CornerThemeValue

/** Stores rounded as an option pick. */
export interface CornerRoundedValue {
  type: ValueType.OPTION
  value: Corner.ROUNDED
}

/** Stores squared as an option pick. */
export interface CornerSquaredValue {
  type: ValueType.OPTION
  value: Corner.SQUARED
}

/** References a named radius step on the theme. */
export interface CornerThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeCornersKey
}

export const cornersSchema: PropertySchema = {
  name: "corners",
  description:
    "Sets border radius per corner using lengths, rounded or squared picks, or theme steps.",
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
      if (typeof value === "object" && value !== null) {
        const o = value as { value?: unknown; unit?: unknown }
        if (
          typeof o.value === "number" &&
          o.value >= 0 &&
          (o.unit === Unit.PX || o.unit === Unit.REM || o.unit === Unit.PERCENT)
        ) {
          return true
        }
      }
      if (typeof value === "number" && value >= 0) return true
      return false
    },
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Corner) as string[]).includes(value),
    themeOrdinal: (value: unknown, theme?: Theme) =>
      themeTokenRefIsValid(value, theme, "corners"),
  },
  presetOptions: () => Object.values(Corner),
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.corners).map((id) => `@corners.${id}`),
}
