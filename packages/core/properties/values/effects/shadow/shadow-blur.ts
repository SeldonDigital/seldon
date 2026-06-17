import { Theme, ThemeBlurKey } from "../../../../themes/types"
import { Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

/** Ordinal reference into the theme blur scale. */
export interface ShadowBlurThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeBlurKey
}

/** Empty, measured blur, or a theme blur step. */
export type ShadowBlurValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ShadowBlurThemeValue

/** Validates stored shadow blur values. */
export const shadowBlurSchema: PropertySchema = {
  name: "shadowBlur",
  description:
    "Sets how soft the shadow edge is using exact lengths or theme blur steps.",
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
      if (
        typeof m.value !== "number" ||
        !Number.isFinite(m.value) ||
        m.value < 0
      )
        return false
      return m.unit === Unit.PX || m.unit === Unit.REM
    },
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.blur
    },
  },
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.blur).map((id) => `@blur.${id}`),
}
