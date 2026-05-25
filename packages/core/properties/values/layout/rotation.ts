import { Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { DegreesValue } from "../shared/exact/degrees"

/** Unset or an exact angle stored in degrees. */
export type RotationValue = EmptyValue | DegreesValue

export const rotationSchema: PropertySchema = {
  name: "rotation",
  description: "Turns the element around its origin using an angle in degrees.",
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
        value !== null &&
        value.value !== undefined &&
        value.unit === Unit.DEGREES
      ) {
        const n = value.value
        return (
          typeof n === "number" &&
          Number.isFinite(n) &&
          n >= -360 &&
          n <= 360
        )
      }
      if (typeof value === "number" && Number.isFinite(value)) {
        return value >= -360 && value <= 360
      }
      return false
    },
  },
}
