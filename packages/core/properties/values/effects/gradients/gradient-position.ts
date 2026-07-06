import { Unit } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

/** Unset or a measured offset for a radial gradient center along one axis. */
export type GradientPositionValue =
  | EmptyValue
  | PixelValue
  | RemValue
  | PercentageValue

function isMeasurePayload(u: unknown): boolean {
  if (typeof u !== "object" || u === null) return false
  const m = u as { value?: unknown; unit?: unknown }
  if (typeof m.value !== "number" || !Number.isFinite(m.value)) return false
  return m.unit === Unit.PX || m.unit === Unit.REM || m.unit === Unit.PERCENT
}

/** Validates one axis of a radial gradient center position. */
export const gradientPositionSchema: PropertySchema = {
  name: "gradientPosition",
  description:
    "Sets where the radial gradient center sits along one axis using px, rem, or percent.",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM, Unit.PERCENT],
    default: Unit.PERCENT,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => isMeasurePayload(value),
  },
}
