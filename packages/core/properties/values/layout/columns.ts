import { Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { NumberValue } from "../shared/exact/number"

/** Unset or a positive integer column count stored as an exact number value. */
export type ColumnCountValue = EmptyValue | NumberValue

export const columnsSchema: PropertySchema = {
  name: "columns",
  description: "How many columns the grid uses, between 1 and 100.",
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
