import { ValueType } from "../../../properties"

import type { Value } from "../../../properties/types/value"
import type { InheritValue } from "../../../properties/values/shared/inherit/inherit"

/**
 * Type guard that checks if a value is an inherit value.
 */
export function isInheritValue(value: Value | InheritValue | undefined): value is InheritValue {
  if (!value || typeof value !== "object") {
    return false
  }

  return "type" in value && value.type === ValueType.INHERIT
}
