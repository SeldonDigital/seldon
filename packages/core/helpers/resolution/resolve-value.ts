import { Value } from "../../properties/types/value"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import { isEmptyValue } from "../type-guards/value/is-empty-value"

/**
 * Filters out empty values, returning undefined for empty values and the original value otherwise
 *
 * @param value - The value to check and potentially return
 * @returns The original value if not empty, undefined otherwise
 */
export function resolveValue<T extends Value>(
  value?: T,
): Exclude<T, EmptyValue> | undefined {
  if (!value || isEmptyValue(value)) return undefined
  return value as Exclude<T, EmptyValue>
}
