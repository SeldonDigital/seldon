import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"
import { DoubleAxisValue } from "../../shared/preset/double-axis"
import { ImageFitValue } from "../../shared/utilities/image-fit"

export type SingleBackgroundSizeValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue
  | ImageFitValue

export type BackgroundSizeValue =
  | EmptyValue
  | SingleBackgroundSizeValue
  | DoubleAxisValue

export const backgroundSizeSchema: PropertySchema = {
  name: "backgroundSize",
  description: "Background image size",
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
    preset: (value: any) => {
      return (
        typeof value === "string" &&
        ["original", "contain", "cover", "stretch"].includes(value)
      )
    },
  },
  presetOptions: () => ["original", "contain", "cover", "stretch"],
}
