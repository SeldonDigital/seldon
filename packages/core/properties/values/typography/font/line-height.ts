import { Theme, ThemeLineHeightKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { NumberValue } from "../../shared/exact/number"
import { PercentageValue } from "../../shared/exact/percentage"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

/** References one named line height step from the theme. */
export interface LineHeightThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeLineHeightKey
}

/** Unset, lengths, a unitless multiplier, or a theme line height token. */
export type LineHeightValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | NumberValue
  | LineHeightThemeValue

/** Validates stored line height values. */
export const lineHeightSchema: PropertySchema = {
  name: "lineHeight",
  description:
    "Sets space between lines using the theme scale, lengths, a multiplier, or a percentage.",
  supports: ["empty", "inherit", "exact", "themeOrdinal"] as const,
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
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return (Object.keys(theme.lineHeight) as string[]).some(
        (id) => value === `@lineHeight.${id}`,
      )
    },
  },
  themeOrdinalKeys: (theme: Theme) =>
    (Object.keys(theme.lineHeight) as string[]).map(
      (id) => `@lineHeight.${id}` as ThemeLineHeightKey,
    ),
}
