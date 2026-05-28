import { Unit } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { DegreesValue } from "../../shared/exact/degrees"

/** Unset or an exact angle in degrees for the gradient direction. */
export type GradientAngleValue = EmptyValue | DegreesValue

/** Validates stored gradient angle values. */
export const gradientAngleSchema: PropertySchema = {
  name: "gradientAngle",
  description: "Sets how many degrees the gradient line tilts.",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [Unit.DEGREES],
    default: Unit.DEGREES,
    validation: "number",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (typeof value !== "object" || value === null) return false
      const m = value as { value?: unknown; unit?: unknown }
      if (m.unit !== Unit.DEGREES || typeof m.value !== "number") return false
      if (!Number.isFinite(m.value)) return false
      return m.value >= -360 && m.value <= 360
    },
  },
}
