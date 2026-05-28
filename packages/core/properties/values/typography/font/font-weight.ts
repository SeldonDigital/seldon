import { Theme, ThemeFontWeightKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { NumberValue } from "../../shared/exact/number"

/** References one step on the theme font weight scale. */
export interface FontWeightThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontWeightKey
}

/** Unset, a numeric weight from 100 through 900, or a theme scale token. */
export type FontWeightValue = EmptyValue | NumberValue | FontWeightThemeValue

/** Validates stored font weight values. */
export const fontWeightSchema: PropertySchema = {
  name: "fontWeight",
  description:
    "Sets how heavy the type looks using the theme scale or a number from 100 through 900.",
  supports: ["empty", "inherit", "exact", "themeOrdinal"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) =>
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 100 &&
      value <= 900,
    themeOrdinal: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return (Object.keys(theme.fontWeight) as string[]).some(
        (id) => value === `@fontWeight.${id}`,
      )
    },
  },
  themeOrdinalKeys: (theme: Theme) =>
    (Object.keys(theme.fontWeight) as string[]).map(
      (id) => `@fontWeight.${id}` as ThemeFontWeightKey,
    ),
}
