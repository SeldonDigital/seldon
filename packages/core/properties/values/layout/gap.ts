import { themeTokenRefIsValid } from "../../../helpers/theme/get-theme-key-components"
import { Unit } from "../../constants"

import type { Theme, ThemeGapKey } from "../../../themes/types"
import type { ValueType } from "../../constants"
import type { PropertySchema } from "../../types/schema"
import type { EmptyValue } from "../shared/empty/empty"
import type { PercentageValue } from "../shared/exact/percentage"
import type { PixelValue } from "../shared/exact/pixel"
import type { RemValue } from "../shared/exact/rem"

/** Catalog spacing choice between children when not using fixed lengths or theme steps. */
export enum Gap {
  EVENLY_SPACED = "evenly-spaced",
  NONE = "none",
}

/** Picks one spacing option from the Gap enum. */
export interface GapOptionValue {
  type: ValueType.OPTION
  value: Gap
}

/** Ordinal reference into the theme gap scale. */
export interface GapThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeGapKey
}

/** All ways gap may be stored between flex or grid children. */
export type GapValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | GapOptionValue
  | GapThemeValue

export const gapSchema: PropertySchema = {
  name: "gap",
  description:
    "Sets space between child elements using px, rem, theme steps, or the catalog option.",
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
      ) {
        return true
      }

      if (typeof value === "number" && value >= 0) return true

      return false
    },
    option: (value: unknown) =>
      typeof value === "string" && (Object.values(Gap) as string[]).includes(value),
    themeOrdinal: (value: unknown, theme?: Theme) => themeTokenRefIsValid(value, theme, "gap"),
  },
  presetOptions: () => Object.values(Gap),
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.gap).map((id) => `@gap.${id}`),
}
