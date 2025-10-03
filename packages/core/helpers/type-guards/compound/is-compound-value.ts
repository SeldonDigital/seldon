import { CompoundValue } from "../../../properties/types/compound-value"
import { Value } from "../../../properties/types/value"

/**
 * Type guard that checks if a property value is a compound value
 *
 * @param value - The property value to check
 * @returns True if the value is a compound value with subproperties
 */
export function isCompoundValue(value: Value): value is CompoundValue {
  return (
    typeof value === "object" &&
    value !== null &&
    !("value" in value) &&
    !("type" in value)
  )
}
