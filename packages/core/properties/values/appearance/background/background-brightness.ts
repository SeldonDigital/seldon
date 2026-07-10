import { Unit } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"

/** Unset or a percentage from -100 through 100 that lightens or darkens one background layer. */
export type BackgroundBrightnessValue = EmptyValue | PercentageValue

/** Validates brightness on one background paint layer. */
export const backgroundBrightnessSchema: PropertySchema = {
  name: "backgroundBrightness",
  description:
    "Sets how much lighter or darker this layer reads, from -100 through 100 percent.",
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
