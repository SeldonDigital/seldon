import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { DegreesValue } from "../shared/exact/degrees"

export type GradientAngleValue = EmptyValue | DegreesValue

export const gradientAngleSchema: PropertySchema = {
  name: "gradientAngle",
  description: "Gradient angle in degrees",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => {
      if (
        typeof value === "object" &&
        value.value !== undefined &&
        value.unit === "deg"
      )
        return true
      if (typeof value === "number" && value >= 0 && value <= 360) return true
      return false
    },
  },
}
