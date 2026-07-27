import { Unit } from "../../constants"

import type { PropertySchema } from "../../types/schema"
import type { EmptyValue } from "../shared/empty/empty"
import type { NumberValue } from "../shared/exact/number"

/** Unset or a positive integer grid row line where the item starts. */
export type RowStartValue = EmptyValue | NumberValue

export const rowStartSchema: PropertySchema = {
  name: "rowStart",
  description: "Grid row line where the item starts, between 1 and 100.",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [],
    default: Unit.NUMBER,
    validation: "number",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      const raw =
        typeof value === "number"
          ? value
          : typeof value === "object" &&
              value !== null &&
              "value" in value &&
              typeof (value as { value: unknown }).value === "number"
            ? (value as { value: number }).value
            : NaN

      return Number.isInteger(raw) && raw >= 1 && raw <= 100
    },
  },
}
