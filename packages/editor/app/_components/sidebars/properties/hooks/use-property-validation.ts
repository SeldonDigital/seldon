/**
 * Hook for property validation logic
 */
import {
  isNumber,
  isPercentage,
  isPx,
  isRem,
} from "@seldon/core/helpers/validation"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { getUnitsForProperty } from "@seldon/core/properties"
import { FlatProperty } from "../helpers/properties-data"

interface UsePropertyValidationResult {
  validationFunction: ((value: string) => boolean) | undefined
  units: string[]
}

/**
 * Returns validation function and units for a property
 */
export function usePropertyValidation(
  property: FlatProperty,
): UsePropertyValidationResult {
  // Exclude units for theme properties that should be plain numbers
  // This includes properties ending with .step (e.g., dimension.huge.step, margin.cozy.step)
  // and font weight properties (e.g., fontWeight.thin, fontWeight.bold)
  const shouldExcludeUnits =
    property.key === "core.ratio" ||
    property.key === "core.size" ||
    property.key.startsWith("fontWeight.") ||
    property.key.endsWith(".step")
  
  // Force Base Font Size to use PX units
  const shouldUsePxOnly = property.key === "core.fontSize"
  
  // Color angle and step should use degrees
  const shouldUseDegOnly = property.key === "color.angle" || property.key === "color.step"
  
  // Color point properties and bleed should use percentage units
  const shouldUsePercentOnly =
    property.key === "color.whitePoint" ||
    property.key === "color.grayPoint" ||
    property.key === "color.blackPoint" ||
    property.key === "color.bleed"
  
  const units = shouldExcludeUnits
    ? []
    : shouldUsePxOnly
      ? ["px"]
      : shouldUseDegOnly
        ? ["deg"]
        : shouldUsePercentOnly
          ? ["%"]
          : getUnitsForProperty(property.key)

  const getValidationFunction = ():
    | ((value: string) => boolean)
    | undefined => {
    if (property.controlType === "combo" || property.controlType === "menu") {
      if (units.length > 0) {
        return (value: string) => {
          if (isThemeValueKey(value)) return true
          return (
            units.some((unit) => value.endsWith(unit)) || !isNaN(Number(value))
          )
        }
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

    if (property.controlType === "text") {
      return undefined
    }

    return undefined
  }

  return {
    validationFunction: getValidationFunction(),
    units,
  }
}
