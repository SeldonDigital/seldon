import { Theme } from "../../../themes/types"
import { ValueType } from "../../constants"
import { ComputedFunction } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedAutoFitValue } from "../shared/computed/auto-fit"
import { ComputedMatchValue } from "../shared/computed/match"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

export interface SizeThemeValue {
  type: ValueType.THEME_ORDINAL
  value: string
}

export type SizeValue =
  | EmptyValue
  | SizeThemeValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue
  | ComputedMatchValue

export const sizeSchema: PropertySchema = {
  name: "size",
  description: "Element size dimensions",
  supports: ["empty", "inherit", "exact", "computed", "themeOrdinal"] as const,
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
      return value in theme.size
    },
  },
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.size),
  computedFunctions: () => [ComputedFunction.AUTO_FIT, ComputedFunction.MATCH],
}
