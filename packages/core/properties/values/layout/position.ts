import { Unit } from "../../constants"

import type { PropertySchema } from "../../types/schema"
import type { EmptyValue } from "../shared/empty/empty"
import type { PercentageValue } from "../shared/exact/percentage"
import type { PixelValue } from "../shared/exact/pixel"
import type { RemValue } from "../shared/exact/rem"

/** Optional offsets from each edge when using positioned layout. */
export interface PositionValue {
  top?: PositionSideValue
  right?: PositionSideValue
  bottom?: PositionSideValue
  left?: PositionSideValue
}

/** One edge offset as unset or a measured length. */
export type PositionSideValue = EmptyValue | PixelValue | RemValue | PercentageValue

export const positionSchema: PropertySchema = {
  name: "position",
  description: "Sets inset offsets on top, right, bottom, and left using lengths.",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM, Unit.PERCENT],
    default: Unit.PX,
    validation: "both",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "value" in value &&
        "unit" in value &&
        value.value !== undefined &&
        value.unit !== undefined
      ) {
        return true
      }

      if (typeof value === "number") return true

      return false
    },
  },
}
