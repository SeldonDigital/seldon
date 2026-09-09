import { ValueType } from "../../../properties"

import type { InheritValue } from "../../../properties/values/shared/inherit/inherit"

/**
 * Type guard that checks if a value is an inherit value.
 */
export function isInheritValue(value: unknown): value is InheritValue {
  if (!value || typeof value !== "object") {
    return false
  }

  return "type" in value && (value as { type: unknown }).type === ValueType.INHERIT
}
