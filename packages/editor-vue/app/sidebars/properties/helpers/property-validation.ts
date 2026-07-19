import {
  isNumber,
  isPercentage,
  isPx,
  isRem,
  isValidColor,
} from "@seldon/core/helpers/validation"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { getUnitsForProperty } from "@seldon/core/properties"
import {
  isColorProperty,
  isFreeTextProperty,
} from "@seldon/editor/lib/properties/serialize-value"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"

/**
 * Returns the validation function for a property, or undefined when the control
 * accepts any input. Ported from the React `usePropertyValidation`.
 */
export function getValidationFunction(
  property: FlatProperty,
): ((value: string) => boolean) | undefined {
  const units = property.units ?? getUnitsForProperty(property.key)

  const isScaleStep =
    property.key.endsWith(".step") && !property.key.startsWith("lineHeight.")

  if (isScaleStep) {
    return (value: string) => isNumber(value) || isPx(value) || isRem(value)
  }

  if (property.controlType === "combo" || property.controlType === "menu") {
    if (isColorProperty(property.key)) {
      return (value: string) => isValidColor(value.trim())
    }
    if (units.length > 0) {
      return (value: string) => {
        if (isThemeValueKey(value)) return true
        return units.some((unit) => value.endsWith(unit)) || !isNaN(Number(value))
      }
    }
    if (isFreeTextProperty(property.key)) {
      return (value: string) => value.trim().length > 0
    }
    return undefined
  }

  if (property.controlType === "number") {
    return (value: string) => {
      if (isNumber(value)) return true
      if (isPercentage(value)) return true
      if (units.length > 0) {
        return units.some((unit) => {
          if (unit === "px" && isPx(value)) return true
          if (unit === "rem" && isRem(value)) return true
          if (unit === "%" && value.endsWith("%") && !isNaN(parseFloat(value))) {
            return true
          }
          if (
            unit === "deg" &&
            value.toLowerCase().endsWith("deg") &&
            !isNaN(parseFloat(value))
          ) {
            return true
          }
          return false
        })
      }
      return false
    }
  }

  return undefined
}
