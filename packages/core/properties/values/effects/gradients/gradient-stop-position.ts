import { Unit } from "../../../constants"

import type { PropertySchema } from "../../../types/schema"
import type { EmptyValue } from "../../shared/empty/empty"
import type { PercentageValue } from "../../shared/exact/percentage"

/** Unset or a percentage from 0 through 100 for where this stop sits along the gradient line. */
export type GradientStopPositionValue = EmptyValue | PercentageValue

/** Validates stored gradient stop position values. */
export const gradientStopPositionSchema: PropertySchema = {
  name: "gradientStopPosition",
  description: "Sets where this stop sits from start to end as a percent from 0 through 100.",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [Unit.PERCENT],
    default: Unit.PERCENT,
    validation: "percentage",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (typeof value === "object" && value !== null) {
        const o = value as { value?: unknown; unit?: unknown }

        if (o.unit === Unit.PERCENT && typeof o.value === "number") {
          return o.value >= 0 && o.value <= 100
        }
      }

      if (typeof value === "number" && value >= 0 && value <= 100) return true

      return false
    },
  },
}
