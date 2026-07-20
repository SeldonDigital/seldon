import { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { isPresetProperty } from "@seldon/editor/lib/properties/property-types"

import { Value, ValueType } from "@seldon/core"

interface UsePropertyControlDataOptions {
  property: FlatProperty
}

/**
 * Hook that provides data and helper functions for property controls.
 * Used by the property-row ViewModel to derive display values and unit labels.
 */
export function usePropertyControlData({
  property,
}: UsePropertyControlDataOptions) {
  // Get property value for display
  const getPropertyValueForDisplay = (): Value => {
    // If the property is dimmed (controlled by a computed main property),
    // show the computed function name instead of the individual value
    if (property.isDimmed && property.actualValue) {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    if (
      property.propertyType === "shorthand" &&
      property.actualValue &&
      property.actualValue !== "unset"
    ) {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    if (
      property.propertyType === "compound" &&
      property.actualValue &&
      property.actualValue !== "unknown" &&
      property.actualValue !== "Error"
    ) {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    if (isPresetProperty(property.key)) {
      if (property.actualValue && property.actualValue !== "unset") {
        return { type: ValueType.EXACT, value: property.actualValue }
      } else {
        return { type: ValueType.EMPTY, value: null }
      }
    }

    if (property.isSubProperty && property.key.includes(".")) {
      const [parentKey] = property.key.split(".")
      if (isPresetProperty(parentKey)) {
        if (property.actualValue && property.actualValue !== "unset") {
          return { type: ValueType.EXACT, value: property.actualValue }
        } else {
          return { type: ValueType.EMPTY, value: null }
        }
      }
    }

    if (property.actualValue && property.key === "theme") {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    // For theme properties, use the formatted actualValue if available
    if (
      property.actualValue &&
      property.value &&
      typeof property.value === "object" &&
      property.value !== null &&
      "type" in property.value &&
      (property.value.type === ValueType.THEME_ORDINAL ||
        property.value.type === ValueType.THEME_CATEGORICAL)
    ) {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    // For swatch and color properties, use the formatted actualValue (HSL string) if available
    // This ensures calculated HSL values display correctly instead of showing the raw object
    if (
      property.actualValue &&
      (property.key.startsWith("swatch.") ||
        property.key === "colorHarmony.baseColor")
    ) {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    return property.value &&
      typeof property.value === "object" &&
      property.value !== null &&
      "type" in property.value &&
      property.value.type &&
      Object.values(ValueType).includes(property.value.type as ValueType)
      ? (property.value as Value)
      : { type: ValueType.EMPTY, value: null }
  }

  // Determine if menu icon (icon3) should be displayed. Only text/number
  // controls render the (transparent) chevron. Menu/combo controls render
  // their own indicator.
  const shouldShowMenuIcon = (): boolean => {
    return property.controlType === "text" || property.controlType === "number"
  }

  return {
    getPropertyValueForDisplay,
    shouldShowMenuIcon,
  }
}
