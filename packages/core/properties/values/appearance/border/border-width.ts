import { Theme, ThemeBorderWidthKey } from "../../../../themes/types"
import { Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

/** Fixed width labels for the border width picker. */
export enum BorderWidth {
  HAIRLINE = "hairline",
}

/** Stores the hairline width choice as an option pick. */
export interface BorderWidthHairlineValue {
  type: ValueType.OPTION
  value: BorderWidth.HAIRLINE
}

/** Ordinal reference into the theme border width scale. */
export interface BorderWidthThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeBorderWidthKey
}

/** Empty, measured lengths, hairline, or a theme border width step. */
export type BorderWidthValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | BorderWidthHairlineValue
  | BorderWidthThemeValue

/** Validates stored border width values. */
export const borderWidthSchema: PropertySchema = {
  name: "borderWidth",
  description:
    "Sets border thickness from the hairline pick, theme scale steps, or measured lengths.",
  supports: ["empty", "inherit", "exact", "option", "themeOrdinal"] as const,
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
      if (typeof m.value !== "number" || !Number.isFinite(m.value) || m.value < 0)
        return false
      return m.unit === Unit.PX || m.unit === Unit.REM
    },
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(BorderWidth) as string[]).includes(value),
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.borderWidth
    },
  },
  presetOptions: () => Object.values(BorderWidth),
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.borderWidth).map((id) => `@borderWidth.${id}`),
}
