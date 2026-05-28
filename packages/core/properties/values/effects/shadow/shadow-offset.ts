import { Unit } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"

/** Empty or measured shift along one shadow axis. */
export type ShadowOffsetValue = EmptyValue | PixelValue | RemValue

/** Validates stored shadow offset values. */
export const shadowOffsetSchema: PropertySchema = {
  name: "shadowOffset",
  description:
    "Sets how far the shadow shifts from the element using pixel or rem lengths.",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM],
    default: Unit.PX,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (typeof value !== "object" || value === null) return false
      const m = value as { value?: unknown; unit?: unknown }
      if (typeof m.value !== "number" || !Number.isFinite(m.value)) return false
      return m.unit === Unit.PX || m.unit === Unit.REM
    },
  },
}
