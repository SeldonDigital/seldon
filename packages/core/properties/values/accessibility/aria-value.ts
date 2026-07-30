import { Unit } from "../../constants"

import type { PropertySchema } from "../../types/schema"
import type { EmptyValue } from "../shared/empty/empty"
import type { NumberValue } from "../shared/exact/number"
import type { InheritValue } from "../shared/inherit/inherit"

/** Empty, inherit, or a numeric reading shared by `ariaValueNow`, `ariaValueMin`, and `ariaValueMax`. */
export type AriaValueValue = EmptyValue | InheritValue | NumberValue

/** Unit block shared by the three aria value properties. The reading is a bare number. */
export const ariaValueUnits: NonNullable<PropertySchema["units"]> = {
  allowed: [],
  default: Unit.NUMBER,
  validation: "number",
}

/** Accepts a bare number or a `Unit.NUMBER` payload, and rejects anything else. */
export function isAriaValueNumber(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value)

  if (typeof value === "object" && value !== null) {
    const inner = value as { value?: unknown; unit?: unknown }

    return (
      inner.unit === Unit.NUMBER && typeof inner.value === "number" && Number.isFinite(inner.value)
    )
  }

  return false
}
