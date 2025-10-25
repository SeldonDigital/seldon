import { Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { DegreesValue } from "../shared/exact/degrees"

export type RotationValue = EmptyValue | DegreesValue

export const rotationSchema: PropertySchema = {
  name: "rotation",
  description: "Element rotation in degrees",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [Unit.DEGREES],
    default: Unit.DEGREES,
    validation: "number",
  },
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
