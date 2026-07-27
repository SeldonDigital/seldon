import { ValueType } from "../../../properties"

import type { Value } from "../../../properties/types/value"
import type { DegreesValue } from "../../../properties/values/shared/exact/degrees"
import type { PercentageValue } from "../../../properties/values/shared/exact/percentage"
import type { PixelValue } from "../../../properties/values/shared/exact/pixel"
import type { RemValue } from "../../../properties/values/shared/exact/rem"

/**
 * Type guard that checks if a value is a unit value (px, rem, %, deg).
 * @param value - The value to check
 * @returns True if the value is a unit value type
 */
export function isUnitValue(
  value: Value,
): value is DegreesValue | PercentageValue | PixelValue | RemValue {
  if (!value || typeof value !== "object") {
    return false
  }

  return (
    "type" in value &&
    value.type === ValueType.EXACT &&
    typeof value.value === "object" &&
    "unit" in value.value
  )
}
