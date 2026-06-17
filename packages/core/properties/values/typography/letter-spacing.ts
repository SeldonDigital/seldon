import { Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

/** Empty or horizontal gap between letters using pixel or rem lengths. */
export type LetterSpacingValue = EmptyValue | PixelValue | RemValue

/** Validates stored letter spacing values. */
export const letterSpacingSchema: PropertySchema = {
  name: "letterSpacing",
  description: "Sets extra space between letters using pixel or rem lengths.",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM],
    default: Unit.REM,
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
