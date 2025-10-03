import { ValueType } from "../../../properties/constants/value-types"
import { Value } from "../../../properties/types/value"
import { DegreesValue } from "../../../properties/values/shared/degrees"
import { PercentageValue } from "../../../properties/values/shared/percentage"
import { PixelValue } from "../../../properties/values/shared/pixel"
import { RemValue } from "../../../properties/values/shared/rem"

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
