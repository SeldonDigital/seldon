import { Theme, ThemeSpreadKey } from "../../../../themes/types"
import { Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

/** Ordinal reference into the theme spread scale. */
export interface ShadowSpreadThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeSpreadKey
}

/** Empty, measured spread, or a theme spread step. */
export type ShadowSpreadValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ShadowSpreadThemeValue

/** Validates stored shadow spread values. */
export const shadowSpreadSchema: PropertySchema = {
  name: "shadowSpread",
  description:
    "Sets how much the shadow grows or shrinks using lengths or theme spread steps.",
  supports: ["empty", "inherit", "exact", "themeOrdinal"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM],
    default: Unit.PX,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (typeof value !== "object" || value === null) return false
      const m = value as { value?: unknown; unit?: unknown }
      if (typeof m.value !== "number" || !Number.isFinite(m.value)) return false
      return m.unit === Unit.PX || m.unit === Unit.REM
    },
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.spread
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.spread),
}
