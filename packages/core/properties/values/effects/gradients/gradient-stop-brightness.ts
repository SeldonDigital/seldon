import { Unit } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"

/** Unset or a percentage from 0 through 100 that lightens or darkens one gradient stop. */
export type GradientStopBrightnessValue = EmptyValue | PercentageValue

/** Validates stored gradient stop brightness values. */
export const gradientStopBrightnessSchema: PropertySchema = {
  name: "gradientStopBrightness",
  description:
    "Sets how much lighter or darker this stop reads, from 0 through 100 percent.",
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
