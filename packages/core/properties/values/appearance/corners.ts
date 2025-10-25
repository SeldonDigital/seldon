import { Theme, ThemeCornersKey } from "../../../themes/types"
import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

export enum Corner {
  ROUNDED = "rounded",
  SQUARED = "squared",
}

export interface CornersValue {
  topLeft?: CornerValue
  topRight?: CornerValue
  bottomLeft?: CornerValue
  bottomRight?: CornerValue
}

export type CornerValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | CornerRoundedValue
  | CornerSquaredValue
  | CornerThemeValue

export interface CornerRoundedValue {
  type: ValueType.PRESET
  value: Corner.ROUNDED
}

export interface CornerSquaredValue {
  type: ValueType.PRESET
  value: Corner.SQUARED
}

export interface CornerThemeValue {
  type: ValueType.THEME_ORDINAL
  value: ThemeCornersKey
}

export const cornersSchema: PropertySchema = {
  name: "corners",
  description: "Border corner radius values",
  supports: ["empty", "inherit", "exact", "preset", "themeOrdinal"] as const,
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
      if (typeof value === "number" && value >= 0) return true
      return false
    },
    preset: (value: any) => Object.values(Corner).includes(value),
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.corners
    },
  },
  presetOptions: () => Object.values(Corner),
  themeOrdinalKeys: (theme: Theme) => Object.keys(theme.corners),
}
