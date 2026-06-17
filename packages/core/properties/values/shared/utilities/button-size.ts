import { Theme, ThemeFontSizeKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../empty/empty"
import { PixelValue } from "../exact/pixel"
import { RemValue } from "../exact/rem"

// ButtonSize uses the font sizes from the theme in order to base size of the icon on the label
export type ButtonSizeValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ButtonSizeThemeValue

export interface ButtonSizeThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontSizeKey
}

export const buttonSizeSchema: PropertySchema = {
  name: "buttonSize",
  description: "Button size based on font size scale",
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
      return (Object.keys(theme.fontSize) as string[]).some(
        (id) => value === `@fontSize.${id}`,
      )
    },
  },
  themeOrdinalKeys: (theme: Theme) =>
    (Object.keys(theme.fontSize) as string[]).map(
      (id) => `@fontSize.${id}` as ThemeFontSizeKey,
    ),
}
