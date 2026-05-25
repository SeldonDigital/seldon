import { ValueType } from "../constants"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function mergeComputedPayload(
  existingValue: Record<string, unknown>,
  nextValue: Record<string, unknown>,
): Record<string, unknown> {
  const existingInput = isRecord(existingValue.input) ? existingValue.input : {}
  const nextInput = isRecord(nextValue.input) ? nextValue.input : {}

  return {
    ...existingValue,
    ...nextValue,
    input: {
      ...existingInput,
      ...nextInput,
    },
  }
}

/**
 * Merges two tagged property values. Computed values merge `value.input` so a
 * partial patch cannot drop required fields such as `basedOn`.
 */
export function mergeTaggedValues(existing: unknown, next: unknown): unknown {
  if (
    isRecord(existing) &&
    isRecord(next) &&
    existing.type === ValueType.COMPUTED &&
    next.type === ValueType.COMPUTED &&
    isRecord(existing.value) &&
    isRecord(next.value)
  ) {
    return {
      type: ValueType.COMPUTED,
      value: mergeComputedPayload(existing.value, next.value),
    }
  }

  if (isRecord(existing) && isRecord(next)) {
    return { ...existing, ...next }
  }

  return next
}
