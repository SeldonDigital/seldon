import { type Value, ValueType } from "@seldon/core"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { isPresetProperty } from "@seldon/editor/lib/properties/property-types"

/**
 * The value shown for a property row, resolving dimmed/compound/shorthand/preset
 * summaries to their formatted `actualValue`. Ported from the React
 * `usePropertyControlData.getPropertyValueForDisplay`.
 */
export function getPropertyValueForDisplay(property: FlatProperty): Value {
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
    }
    return { type: ValueType.EMPTY, value: null }
  }

  if (property.isSubProperty && property.key.includes(".")) {
    const [parentKey] = property.key.split(".")
    if (isPresetProperty(parentKey)) {
      if (property.actualValue && property.actualValue !== "unset") {
        return { type: ValueType.EXACT, value: property.actualValue }
      }
      return { type: ValueType.EMPTY, value: null }
    }
  }

  if (property.actualValue && property.key === "theme") {
    return { type: ValueType.EXACT, value: property.actualValue }
  }

  const value = property.value
  const typedValue = value as { type?: ValueType } | null | undefined
  if (
    property.actualValue &&
    value &&
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (typedValue?.type === ValueType.THEME_ORDINAL ||
      typedValue?.type === ValueType.THEME_CATEGORICAL)
  ) {
    return { type: ValueType.EXACT, value: property.actualValue }
  }

  if (
    property.actualValue &&
    (property.key.startsWith("swatch.") ||
      property.key === "colorHarmony.baseColor")
  ) {
    return { type: ValueType.EXACT, value: property.actualValue }
  }

  return value &&
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typedValue?.type &&
    Object.values(ValueType).includes(typedValue.type)
    ? (value as Value)
    : { type: ValueType.EMPTY, value: null }
}

/**
 * Whether the (transparent) menu chevron should render. Only text/number
 * controls render it; menu/combo controls render their own indicator.
 */
export function shouldShowMenuIcon(property: FlatProperty): boolean {
  return property.controlType === "text" || property.controlType === "number"
}
