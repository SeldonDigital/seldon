import { ComputedFunction, ValueType } from "../../../properties/constants"
import type { ComputedValue } from "../../../properties/values/shared/computed/computed-value"
import type { ComputedMatchColorValue } from "../../../properties/values/shared/computed/match-color"

/**
 * Type guard for a `COMPUTED` value. The payload `value.value` is a `ComputedFunction`.
 */
export function isComputedValue(value: unknown): value is ComputedValue {
  return (
    !!value &&
    typeof value === "object" &&
    "type" in value &&
    (value as { type: unknown }).type === ValueType.COMPUTED
  )
}

/**
 * Type guard for a `COMPUTED` value whose function is `MATCH_COLOR`.
 */
export function isMatchColorValue(
  value: unknown,
): value is ComputedMatchColorValue {
  return (
    isComputedValue(value) &&
    (value as ComputedMatchColorValue).value === ComputedFunction.MATCH_COLOR
  )
}
