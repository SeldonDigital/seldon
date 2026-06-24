import { Theme, ThemeFontSizeKey } from "../../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { ComputedAutoFitValue } from "../../shared/computed/auto-fit"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

/** References one step on the theme font size scale. */
export interface FontSizeThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontSizeKey
}

/** Unset, lengths, theme scale steps, or computed sizing rules. */
export type FontSizeValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue
  | FontSizeThemeValue

/** Validates font size payloads for catalog and editor checks. */
export const fontSizeSchema: PropertySchema = {
  name: "fontSize",
  description:
    "Sets text size from the theme scale, rem or px lengths, or a computed rule.",
  supports: ["empty", "inherit", "exact", "computed", "themeOrdinal"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "value" in value &&
        "unit" in value
      ) {
        return true
      }
      return typeof value === "number" && value > 0
    },
    computed: (value: unknown) => value === ComputedFunction.AUTO_FIT,
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return (Object.keys(theme.fontSize) as string[]).some(
        (id) => value === `@fontSize.${id}`,
      )
    },
  },
  themeOrdinalKeys: (theme: Theme) =>
    (Object.keys(theme.fontSize) as string[]).map(
      (id) => `@fontSize.${id}` as ThemeFontSizeKey,
    ),
  computedFunctions: () => [ComputedFunction.AUTO_FIT],
  units: {
    allowed: [Unit.REM, Unit.PX],
    default: Unit.REM,
    validation: "both",
  },
}
