import { ComputedFunction, Unit, ValueType } from "../../properties"
import { Value } from "../../properties/types/value"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import { HSLObjectToString } from "../color/hsl-object-to-string"
import { LCHObjectToString } from "../color/lch-object-to-string"
import { RGBObjectToString } from "../color/rgb-object-to-string"
import { isHSLObject } from "../type-guards/color/is-hsl-object"
import { isLCHObject } from "../type-guards/color/is-lch-object"
import { isRGBObject } from "../type-guards/color/is-rgb-object"
import { isCompoundValue } from "../type-guards/compound/is-compound-value"
import { isEmptyValue } from "../type-guards/value/is-empty-value"

/**
 * Converts a Value object to its string representation for display purposes.
 *
 * Handles all value types including exact values, theme references, computed values,
 * and compound values. For compound values, returns "Custom" if sub-values differ,
 * or the common value if all sub-values are identical.
 *
 * @param value - The Value object to convert
 * @returns The string representation of the Value object, or undefined if empty
 */
export function stringifyValue(
  value: Value | EmptyValue | undefined,
): string | undefined {
  if (!value || isEmptyValue(value)) {
    return undefined
  }

  if (isCompoundValue(value)) {
    const subValues = Object.values(value).map((subValue) =>
      stringifyValue(subValue),
    )

    // If all sub values are equal, for example all margin sides are the same, return the first one
    if (subValues.every((subValue) => subValue === subValues[0])) {
      return subValues[0]
    }

    return "Custom"
  }

  // Check if value has a type property (atomic values)
  if (!("type" in value)) {
    return "Custom"
  }

  switch (value.type) {
    case ValueType.COMPUTED:
      // Extract function name from computed value
      if (
        value &&
        typeof value === "object" &&
        "value" in value &&
        value.value &&
        typeof value.value === "object" &&
        "function" in value.value
      ) {
        const functionName = value.value.function
        switch (functionName) {
          case ComputedFunction.AUTO_FIT:
            return "Auto Fit"
          case ComputedFunction.HIGH_CONTRAST_COLOR:
            return "High Contrast Color"
          case ComputedFunction.OPTICAL_PADDING:
            return "Optical Padding"
          case ComputedFunction.MATCH:
            return "Match"
          default:
            return "Computed"
        }
      }
      return "Computed"

    case ValueType.EXACT: {
      switch (typeof value.value) {
        case "number":
          return String(value.value)
        case "string":
          return value.value
        case "boolean":
          return value.value ? "On" : "Off"
        case "object": {
          if (isRGBObject(value.value)) {
            return RGBObjectToString(value.value)
          }

          if (isHSLObject(value.value)) {
            return HSLObjectToString(value.value)
          }

          if (isLCHObject(value.value)) {
            return LCHObjectToString(value.value)
          }

          if ("x" in value.value && "y" in value.value) {
            return `${value.value.x.value}${value.value.x.unit} ${value.value.y.value}${value.value.y.unit}`
          }

          if ("unit" in value.value) {
            switch (value.value.unit) {
              case Unit.PX:
                return `${value.value.value}px`
              case Unit.PERCENT:
                return `${value.value.value}%`
              case Unit.REM:
                return `${value.value.value}rem`
              case Unit.DEGREES:
                return `${value.value.value}°`
              case Unit.NUMBER:
                return `${value.value.value}`
              default:
                throw new Error(
                  `Unknown unit: ${(value.value as { unit: string }).unit}`,
                )
            }
          }
        }
      }

      throw new Error(`Unable to stringify value: ${JSON.stringify(value)}`)
    }

    case ValueType.PRESET:
    case ValueType.THEME_ORDINAL:
    case ValueType.THEME_CATEGORICAL:
      return value.value

    case ValueType.INHERIT:
      return "Inherit"

    default:
      throw new Error(`Unknown value type: ${(value as { type: string }).type}`)
  }
}
