import { ThemeFontSizeKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ComputedFunction, Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { ComputedAutoFitValue } from "../../shared/computed/auto-fit"
import { ComputedMatchValue } from "../../shared/computed/match"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

export interface FontSizeThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeFontSizeKey
}

export type FontSizeValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue
  | ComputedMatchValue
  | FontSizeThemeValue

export const fontSizeSchema: PropertySchema = {
  name: "fontSize",
  description: "Font size for text styling",
  supports: ["empty", "inherit", "exact", "computed", "themeOrdinal"] as const,
  units: {
    allowed: [Unit.REM, Unit.PX],
    default: Unit.REM,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => {
      if (
        typeof value === "object" &&
        value.value !== undefined &&
        value.unit !== undefined
      )
        return true
      if (typeof value === "number" && value > 0) return true
      return false
    },
    computed: (value: any) =>
      typeof value === "object" && value.function !== undefined,
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.fontSize
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.fontSize),
  computedFunctions: () => [ComputedFunction.AUTO_FIT, ComputedFunction.MATCH],
}
