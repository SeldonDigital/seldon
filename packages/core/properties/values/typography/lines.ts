import { Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { NumberValue } from "../shared/exact/number"

/** Unset or a whole number line count stored as an exact number value. */
export type LinesValue = EmptyValue | NumberValue

function exactNumberPayload(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "object" && value !== null) {
    const inner = value as { value?: unknown; unit?: unknown }
    if (
      inner.unit === Unit.NUMBER &&
      typeof inner.value === "number" &&
      Number.isFinite(inner.value)
    ) {
      return inner.value
    }
  }
  return null
}

/** Validates stored line count values. */
export const linesSchema: PropertySchema = {
  name: "lines",
  description: "Sets how many text lines may appear using zero or a positive whole number.",
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
      const n = exactNumberPayload(value)
      return n !== null && Number.isInteger(n) && n >= 0
    },
  },
}
