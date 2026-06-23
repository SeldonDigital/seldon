import { ComputedFunction, ValueType } from "../../../properties/constants"
import type { ComputedValue } from "../../../properties/values/shared/computed/computed-value"
import type { ComputedMatchValue } from "../../../properties/values/shared/computed/match"

/**
 * Type guard for the bare `ComputedFunction` payload stored at `value.value` of a COMPUTED value.
 */
export function isComputedFunction(value: unknown): value is ComputedFunction {
  return (
    typeof value === "string" &&
    (Object.values(ComputedFunction) as string[]).includes(value)
  )
}

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
 * Type guard for a `COMPUTED` value whose function is `MATCH`.
 */
export function isMatchValue(value: unknown): value is ComputedMatchValue {
  return (
    isComputedValue(value) &&
    (value as ComputedMatchValue).value === ComputedFunction.MATCH
  )
}
