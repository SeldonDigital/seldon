import { Theme } from "../../../themes/types"
import { Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { DimensionValue } from "./dimension"

export type ScreenWidthValue = EmptyValue | DimensionValue

export const screenWidthSchema: PropertySchema = {
  name: "screenWidth",
  description: "Screen width dimension",
  supports: ["empty", "exact", "preset"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM],
    default: Unit.PX,
    validation: "both",
  },
  validation: {
    empty: () => true,
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
    preset: (value: any) => typeof value === "string" && value.length > 0,
    themeOrdinal: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.dimension
    },
  },
  presetOptions: () => [
    "fit",
    "fill",
    "desktop",
    "laptop",
    "tablet",
    "mobile",
    "watch",
    "television",
  ],
}
