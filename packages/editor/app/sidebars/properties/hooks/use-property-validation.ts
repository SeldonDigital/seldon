/**
 * Hook for property validation logic
 */
import {
  isColorProperty,
  isFreeTextProperty,
} from "@lib/properties/serialize-value"
import {
  isNumber,
  isPercentage,
  isPx,
  isRem,
  isValidColor,
} from "@seldon/core/helpers/validation"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { getUnitsForProperty } from "@seldon/core/properties"
import { FlatProperty } from "../helpers/properties-data"

interface UsePropertyValidationResult {
  validationFunction: ((value: string) => boolean) | undefined
}

/**
 * Returns the validation function for a property. Unit lists are derived
 * internally to validate typed values against the property's allowed units.
 */
export function usePropertyValidation(
  property: FlatProperty,
): UsePropertyValidationResult {
  // Exclude units for theme properties that should be plain numbers
  // This includes properties ending with .step (e.g., dimension.huge.step, margin.cozy.step)
  // and font weight properties (e.g., fontWeight.thin, fontWeight.bold)
  const shouldExcludeUnits =
    property.key === "modulation.ratio" ||
    property.key === "modulation.baseSize" ||
    property.key.startsWith("fontWeight.") ||
    property.key.endsWith(".step")

  // Force Base Font Size to use PX units
  const shouldUsePxOnly = property.key === "modulation.baseFontSize"

  // Color angle and step should use degrees
  const shouldUseDegOnly =
    property.key === "colorHarmony.angle" ||
    property.key === "colorHarmony.step"

  // Color point properties and bleed should use percentage units
  const shouldUsePercentOnly =
    property.key === "colorHarmony.whitePoint" ||
    property.key === "colorHarmony.grayPoint" ||
    property.key === "colorHarmony.blackPoint" ||
    property.key === "colorHarmony.bleed"

  const units = shouldExcludeUnits
    ? []
    : shouldUsePxOnly
      ? ["px"]
      : shouldUseDegOnly
        ? ["deg"]
        : shouldUsePercentOnly
          ? ["%"]
          : getUnitsForProperty(property.key)

  // Scale `.step` rows accept a bare number (modulated step) or a px/rem length
  // (exact). `lineHeight` stays a unitless number, so it is excluded.
  const isScaleStep =
    property.key.endsWith(".step") && !property.key.startsWith("lineHeight.")

  const getValidationFunction = ():
    | ((value: string) => boolean)
    | undefined => {
    if (isScaleStep) {
      return (value: string) => isNumber(value) || isPx(value) || isRem(value)
    }

    if (property.controlType === "combo" || property.controlType === "menu") {
      // Color combos accept typed hex/hsl/rgb/lch and `@swatch.*` values, which
      // the commit path serializes through `serializeColor`. This precedes the
      // unit check because color schemas carry no units and fall back to the
      // default px/rem/% list, which would otherwise reject color strings.
      if (isColorProperty(property.key)) {
        return (value: string) => isValidColor(value.trim())
      }
      if (units.length > 0) {
        return (value: string) => {
          if (isThemeValueKey(value)) return true
          return (
            units.some((unit) => value.endsWith(unit)) || !isNaN(Number(value))
          )
        }
      }
      // Free-text combos (image source url) accept any non-empty custom value.
      // Without a validator the combobox rejects typed input outright.
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

  return {
    validationFunction: getValidationFunction(),
  }
}
