import { ValueType } from "../../../properties/constants/value-types"
import { Value } from "../../../properties/types/value"
import { EmptyValue } from "../../../properties/values/shared/empty"

/**
 * Type guard that checks if a value is an empty value.
 * @param value - The value to check
 * @returns True if the value is an EmptyValue type
 */
export function isEmptyValue(
  value: Value | EmptyValue | undefined,
): value is EmptyValue {
  if (!value || typeof value !== "object") {
    return false
  }

  return "type" in value && value.type === ValueType.EMPTY
}
