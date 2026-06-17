import { Theme, Value, ValueType } from "@seldon/core"
import { getUnitsForProperty } from "@seldon/core/properties"
import { FlatProperty } from "../helpers/properties-data"
import { shouldUsePresetPropertyBehavior } from "../helpers/property-types"
import { getPropertyPlaceholder } from "../helpers/shared-utils"

interface UsePropertyControlDataOptions {
  property: FlatProperty
  theme?: Theme
  // theme is kept for future use but currently unused
}

/** Reads the unit of an EXACT dimension value, or undefined for other values. */
function getUnitFromExactValue(value: unknown): string | undefined {
  if (
    value &&
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as { type: ValueType }).type === ValueType.EXACT &&
    "value" in value &&
    typeof (value as { value: unknown }).value === "object" &&
    (value as { value: unknown }).value !== null &&
    "unit" in (value as { value: object }).value
  ) {
    return String((value as { value: { unit: string } }).value.unit)
  }
  return undefined
}

function isEmptyValue(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as { type: ValueType }).type === ValueType.EMPTY
  )
}

/**
 * Resolves the display unit from a property value. Collapses shorthand values
 * (margin, padding, ...) to a single unit when every present side is an exact
 * dimension that shares it. Returns undefined for compound values that mix in
 * non-dimension facets (border, font, ...), so only true dimensions show a unit.
 */
export function resolveUnitFromValue(value: unknown): string | undefined {
  const direct = getUnitFromExactValue(value)
  if (direct) {
    return direct
  }

  if (
    !value ||
    typeof value !== "object" ||
    value === null ||
    "type" in value
  ) {
    return undefined
  }

  let resolved: string | undefined
  for (const subValue of Object.values(value)) {
    if (isEmptyValue(subValue)) {
      continue
    }
    const subUnit = getUnitFromExactValue(subValue)
    if (!subUnit) {
      return undefined
    }
    if (resolved === undefined) {
      resolved = subUnit
    } else if (resolved !== subUnit) {
      return undefined
    }
  }

  return resolved
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

    if (shouldUsePresetPropertyBehavior(property.key)) {
      if (property.actualValue && property.actualValue !== "unset") {
        return { type: ValueType.EXACT, value: property.actualValue }
      } else {
        return { type: ValueType.EMPTY, value: null }
      }
    }

    if (property.isSubProperty && property.key.includes(".")) {
      const [parentKey] = property.key.split(".")
      if (shouldUsePresetPropertyBehavior(parentKey)) {
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
      (property.key.startsWith("swatch.") || property.key === "color.baseColor")
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

  // Get unit (PX/REM) for label2Props
  const getUnit = (): string | undefined => {
    const isPickerControl =
      property.controlType === "combo" || property.controlType === "menu"

    // Exclude units for theme properties that should be plain numbers (check first)
    // This includes properties ending with .step (e.g., dimension.huge.step, margin.cozy.step)
    // and font weight properties (e.g., fontWeight.thin, fontWeight.bold)
    if (
      property.key === "core.ratio" ||
      property.key === "core.size" ||
      property.key.startsWith("fontWeight.") ||
      property.key.endsWith(".step")
    ) {
      return undefined
    }

    // Force Base Font Size to use PX units
    if (property.key === "core.fontSize") {
      return "PX"
    }

    // Color angle and step should use degrees
    if (property.key === "color.angle" || property.key === "color.step") {
      return "DEG"
    }

    // Color point properties and bleed should use percentage units
    if (
      property.key === "color.whitePoint" ||
      property.key === "color.grayPoint" ||
      property.key === "color.blackPoint" ||
      property.key === "color.bleed"
    ) {
      return "%"
    }

    // Try to get the unit from the raw stored value. Shorthand values (margin,
    // padding, ...) collapse to a uniform side unit; other values read the unit
    // directly from an exact dimension. The display value is not used here
    // because it flattens shorthands to a plain string without a unit object.
    const unit = property.isShorthand
      ? resolveUnitFromValue(property.value)
      : getUnitFromExactValue(property.value)
    if (unit) {
      // Map unit values to display format
      if (unit === "px") return "PX"
      if (unit === "rem") return "REM"
      if (unit === "%") return "%"
      if (unit === "deg") return "DEG"
      return unit.toUpperCase()
    }

    // Picker controls list their choices in a dropdown. Only show a unit when the
    // value itself carries one, never a fallback for presets or theme tokens.
    if (isPickerControl) {
      return undefined
    }

    // Fallback: return the first allowed unit if no value is set
    const units = getUnitsForProperty(property.key)
    return units.length > 0 ? units[0].toUpperCase() : undefined
  }

  // Determine if menu icon (icon3) should be displayed
  // Returns false for properties with options (menu/combo) - they don't need a chevron
  // Returns true for properties without options (text/number) - chevron will be transparent
  const shouldShowMenuIcon = (): boolean => {
    // Don't show chevron for properties with options (menu/combo)
    if (property.controlType === "menu" || property.controlType === "combo") {
      return false
    }
    if (property.isCompound && !property.controlType) {
      return false
    }
    // Show chevron (transparent) for properties without options (text/number)
    return property.controlType === "text" || property.controlType === "number"
  }

  // Get placeholder
  const getPlaceholder = (defaultPlaceholder: string): string => {
    return getPropertyPlaceholder(property, defaultPlaceholder)
  }

  const getDefaultPlaceholder = (): string => {
    if (!property.controlType) return "No control"
    switch (property.controlType) {
      case "combo":
        return "Select or enter value"
      case "menu":
        return "Select value"
      case "number":
        return "Enter number"
      case "text":
        return "Enter text"
      default:
        return "Enter value"
    }
  }

  return {
    getPropertyValueForDisplay,
    getUnit,
    shouldShowMenuIcon,
    getPlaceholder: () => getPlaceholder(getDefaultPlaceholder()),
  }
}
