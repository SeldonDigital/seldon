import {
  COMPUTED_FUNCTION_DISPLAY_NAMES,
  ComputedFunction,
  Unit,
  ValueType,
} from "../../properties"
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

  if (!("type" in value)) {
    return "Custom"
  }

  switch (value.type) {
    case ValueType.COMPUTED:
      return stringifyComputedValue(value)

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
            return stringifyUnitValue(value.value)
          }

          // An EXACT value can wrap another tagged value; unwrap and stringify it.
          if ("type" in value.value) {
            return stringifyValue(value.value as Value)
          }
        }
      }

      throw new Error(`Unable to stringify value: ${JSON.stringify(value)}`)
    }

    case ValueType.OPTION:
    case ValueType.THEME_ORDINAL:
    case ValueType.THEME_CATEGORICAL:
      // Option values are usually strings, but a boolean option (such as a
      // yes/no toggle) stringifies to a readable On/Off label.
      return typeof value.value === "boolean"
        ? value.value
          ? "On"
          : "Off"
        : value.value

    case ValueType.INHERIT:
      return "Inherit"

    default:
      throw new Error(`Unknown value type: ${(value as { type: string }).type}`)
  }
}

/** Returns a display label for a COMPUTED value based on its function. */
function stringifyComputedValue(value: Value): string {
  if (typeof value === "object" && "value" in value) {
    return (
      COMPUTED_FUNCTION_DISPLAY_NAMES[value.value as ComputedFunction] ??
      "Computed"
    )
  }
  return "Computed"
}

/** Formats a unit-bearing exact value, such as `16px` or `1.5rem`. */
function stringifyUnitValue(unitValue: { unit: Unit; value: number }): string {
  switch (unitValue.unit) {
    case Unit.PX:
      return `${unitValue.value}px`
    case Unit.PERCENT:
      return `${unitValue.value}%`
    case Unit.REM:
      return `${unitValue.value}rem`
    case Unit.DEGREES:
      return `${unitValue.value}°`
    case Unit.NUMBER:
      return `${unitValue.value}`
    default:
      throw new Error(`Unknown unit: ${(unitValue as { unit: string }).unit}`)
  }
}
