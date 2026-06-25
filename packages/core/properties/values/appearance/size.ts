import { Theme, ThemeSizeKey } from "../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedAutoFitValue } from "../shared/computed/auto-fit"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** References a named step on the theme size scale. */
export interface SizeThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeSizeKey
}

/** Unset, px or rem lengths, theme size steps, or the auto-fit computed rule. */
export type SizeValue =
  | EmptyValue
  | SizeThemeValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue

export const sizeSchema: PropertySchema = {
  name: "size",
  description:
    "Sets catalog size from pixels, root lengths, theme size steps, or the auto-fit computed rule.",
  supports: ["empty", "inherit", "exact", "computed", "themeOrdinal"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM],
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
          o.value > 0 &&
          (o.unit === Unit.PX || o.unit === Unit.REM)
        ) {
          return true
        }
      }
      if (typeof value === "number" && value > 0) return true
      return false
    },
    computed: (value: unknown) => value === ComputedFunction.AUTO_FIT,
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.size
    },
  },
  themeOrdinalKeys: (theme: Theme) =>
    Object.keys(theme.size).map((id) => `@size.${id}`),
  computedFunctions: () => [ComputedFunction.AUTO_FIT],
}
