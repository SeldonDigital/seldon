import { Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { NumberValue } from "../shared/exact/number"

/** Unset or a positive integer count of grid columns the item spans. */
export type ColumnSpanValue = EmptyValue | NumberValue

export const columnSpanSchema: PropertySchema = {
  name: "columnSpan",
  description: "How many grid columns the item spans, between 1 and 100.",
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
