import { Value } from "../../../properties/types/value"
import { AtomicValue } from "../../../properties/types/value-atomic"

/**
 * Type guard that checks if a property value is an atomic value
 *
 * @param value - The property value to check
 * @returns True if the value is an atomic value with type and value properties
 */
export function isAtomicValue(value: Value): value is AtomicValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    "type" in value
  )
}
