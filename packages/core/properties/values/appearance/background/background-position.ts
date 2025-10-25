import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"
import { DoubleAxisValue } from "../../shared/preset/double-axis"

export enum BackgroundPosition {
  DEFAULT = "default",
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  CENTER_LEFT = "center-left",
  CENTER = "center",
  CENTER_RIGHT = "center-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}

export interface BackgroundPositionPresetValue {
  type: ValueType.PRESET
  value: BackgroundPosition
}

export type BackgroundPositionValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | BackgroundPositionPresetValue
  | DoubleAxisValue

export const backgroundPositionSchema: PropertySchema = {
  name: "backgroundPosition",
  description: "Background image position",
  supports: ["empty", "inherit", "exact", "preset"] as const,
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
    preset: (value: any) => Object.values(BackgroundPosition).includes(value),
  },
  presetOptions: () => Object.values(BackgroundPosition),
}
