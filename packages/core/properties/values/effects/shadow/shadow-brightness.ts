import { Unit } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"

/** Unset or a percentage from -100 through 100 that lightens or darkens the shadow. */
export type ShadowBrightnessValue = EmptyValue | PercentageValue

/** Validates stored shadow brightness values. */
export const shadowBrightnessSchema: PropertySchema = {
  name: "shadowBrightness",
  description:
    "Sets how much lighter or darker the shadow reads, from -100 through 100 percent.",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [Unit.PERCENT],
    default: Unit.PERCENT,
    validation: "signedPercentage",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (typeof value === "object" && value !== null) {
        const o = value as { value?: unknown; unit?: unknown }
        if (o.unit === Unit.PERCENT && typeof o.value === "number") {
          return o.value >= -100 && o.value <= 100
        }
      }
      if (typeof value === "number" && value >= -100 && value <= 100)
        return true
      return false
    },
  },
}
